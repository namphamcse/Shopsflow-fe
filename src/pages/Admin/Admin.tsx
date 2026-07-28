import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  getAllOrders,
  getCategories,
  getAllProducts,
  updateCategory,
  updateOrderStatus,
  updateProduct,
} from "../../api/storeApi";
import { getApiErrorMessage } from "../../api/client";
import { Loading } from "../../components/common/Loading";
import type { Category, Order, OrderStatus, Product } from "../../types";
import { formatCurrency, formatDate } from "../../utils/format";

const statuses: OrderStatus[] = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
type Tab = "products" | "categories" | "orders";
type ProductForm = { name: string; description: string; price: string; imageUrl: string; stockQuantity: string; categoryIds: number[] };
const blankProduct: ProductForm = { name: "", description: "", price: "", imageUrl: "", stockQuantity: "0", categoryIds: [] };
type CloudinaryUploadResponse = {
  secure_url?: unknown;
  error?: { message?: unknown };
};

export default function Admin() {
  const [tab, setTab] = useState<Tab>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<ProductForm>(blankProduct);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      queueMicrotask(() => {
        if (!controller.signal.aborted) setLoading(true);
      });
      const results = await Promise.allSettled([
        getAllProducts({ sort: "createdAt,desc" }, controller.signal),
        getCategories(controller.signal),
        getAllOrders(controller.signal),
      ]);

      if (controller.signal.aborted) return;

      const [productResult, categoryResult, orderResult] = results;
      const failedSections: string[] = [];

      if (productResult.status === "fulfilled") {
        setProducts(productResult.value);
      } else {
        setProducts([]);
        failedSections.push("products");
      }

      if (categoryResult.status === "fulfilled") {
        setCategories(categoryResult.value);
      } else {
        setCategories([]);
        failedSections.push("categories");
      }

      if (orderResult.status === "fulfilled") {
        setOrders([...orderResult.value].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)));
      } else {
        setOrders([]);
        failedSections.push("orders");
      }

      if (failedSections.length > 0) {
        toast.error(`Could not load: ${failedSections.join(", ")}.`);
      }
      setLoading(false);
    }

    void loadData();
    return () => {
      controller.abort();
    };
  }, []);

  const inventoryValue = useMemo(() => products.reduce((sum, product) => sum + product.price * product.stockQuantity, 0), [products]);

  function editProduct(product: Product) {
    setEditingProductId(product.id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      imageUrl: product.imageUrl || "",
      stockQuantity: String(product.stockQuantity),
      categoryIds: product.categories.map((category) => category.id),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetProductForm() {
    setEditingProductId(null);
    setForm(blankProduct);
  }

  async function uploadProductImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Choose an image smaller than 10 MB.");
      return;
    }

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      toast.error("Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET first.");
      return;
    }

    setUploadingImage(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", uploadPreset);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body,
      });
      const result = await response.json() as CloudinaryUploadResponse;

      if (!response.ok) {
        const message = typeof result.error?.message === "string" && result.error.message.trim()
          ? result.error.message
          : "Could not upload the image.";
        throw new Error(message);
      }

      if (typeof result.secure_url !== "string" || !result.secure_url.trim()) {
        throw new Error("Cloudinary did not return an image URL.");
      }

      setForm((current) => ({ ...current, imageUrl: result.secure_url as string }));
      toast.success("Image uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not upload the image.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const price = Number(form.price);
    const stockQuantity = Number(form.stockQuantity);
    if (!form.name.trim() || !Number.isFinite(price) || price <= 0 || !Number.isInteger(stockQuantity) || stockQuantity < 0) {
      toast.error("Enter a name, a positive price and a valid stock quantity.");
      return;
    }
    setSaving(true);
    try {
      const payload = { name: form.name.trim(), description: form.description.trim(), price, imageUrl: form.imageUrl.trim(), stockQuantity, categoryIds: form.categoryIds };
      const saved = editingProductId ? await updateProduct(editingProductId, payload) : await createProduct(payload);
      setProducts((current) => editingProductId ? current.map((product) => product.id === saved.id ? saved : product) : [saved, ...current]);
      toast.success(editingProductId ? "Product updated." : "Product created.");
      resetProductForm();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not save the product."));
    } finally {
      setSaving(false);
    }
  }

  async function removeProduct(id: number) {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      await deleteProduct(id);
      setProducts((current) => current.filter((product) => product.id !== id));
      toast.success("Product deleted.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not delete the product."));
    }
  }

  async function saveCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = categoryName.trim();
    if (!name) return;
    setSaving(true);
    try {
      const saved = editingCategoryId ? await updateCategory(editingCategoryId, name) : await createCategory(name);
      setCategories((current) => editingCategoryId ? current.map((category) => category.id === saved.id ? saved : category) : [...current, saved]);
      if (editingCategoryId) {
        setProducts((current) => current.map((product) => ({
          ...product,
          categories: product.categories.map((category) => category.id === saved.id ? saved : category),
        })));
      }
      setCategoryName("");
      setEditingCategoryId(null);
      toast.success(editingCategoryId ? "Category updated." : "Category created.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not save the category."));
    } finally {
      setSaving(false);
    }
  }

  async function removeCategory(id: number) {
    if (!window.confirm("Delete this category?")) return;
    try {
      await deleteCategory(id);
      setCategories((current) => current.filter((category) => category.id !== id));
      setProducts((current) => current.map((product) => ({
        ...product,
        categories: product.categories.filter((category) => category.id !== id),
      })));
      setForm((current) => ({
        ...current,
        categoryIds: current.categoryIds.filter((categoryId) => categoryId !== id),
      }));
      if (editingCategoryId === id) {
        setEditingCategoryId(null);
        setCategoryName("");
      }
      toast.success("Category deleted.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not delete the category. It may still be assigned to products."));
    }
  }

  async function changeOrderStatus(orderId: number, status: OrderStatus) {
    try {
      const updated = await updateOrderStatus(orderId, status);
      setOrders((current) => current.map((order) => order.id === orderId ? updated : order));
      toast.success(`Order #${orderId} moved to ${status}.`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not update the order."));
    }
  }

  if (loading) return <main className="page-shell"><Loading label="Loading admin workspace" /></main>;

  return (
    <main className="page-shell admin-page">
      <header className="page-heading compact-heading"><div><p className="section-kicker">Admin workspace</p><h1>Run the shop.</h1></div><p>Manage inventory, taxonomy and fulfillment from one focused view.</p></header>
      <section className="admin-stats">
        <div><span>Products</span><strong>{products.length}</strong></div>
        <div><span>Categories</span><strong>{categories.length}</strong></div>
        <div><span>Open orders</span><strong>{orders.filter((order) => !["DELIVERED", "CANCELLED"].includes(order.status)).length}</strong></div>
        <div><span>Inventory value</span><strong>{formatCurrency(inventoryValue)}</strong></div>
      </section>

      <nav className="admin-tabs">
        {(["products", "categories", "orders"] as Tab[]).map((item) => <button className={tab === item ? "is-active" : ""} key={item} onClick={() => setTab(item)}>{item}</button>)}
      </nav>

      {tab === "products" && (
        <div className="admin-split">
          <form className="admin-form-card" onSubmit={saveProduct}>
            <div className="admin-form-title"><div><p className="section-kicker">{editingProductId ? "Edit product" : "New product"}</p><h2>{editingProductId ? `Product #${editingProductId}` : "Add to catalog"}</h2></div>{editingProductId && <button type="button" className="text-button" onClick={resetProductForm}>Cancel</button>}</div>
            <label className="form-field"><span>Name</span><input value={form.name} maxLength={150} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
            <label className="form-field"><span>Description</span><textarea rows={5} maxLength={2000} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
            <div className="form-grid-two"><label className="form-field"><span>Price (USD)</span><input type="number" min="0.01" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></label><label className="form-field"><span>Stock</span><input type="number" min="0" step="1" value={form.stockQuantity} onChange={(event) => setForm({ ...form, stockQuantity: event.target.value })} /></label></div>
            <div className="form-field image-upload-field">
              <span>Product image</span>
              <div className="image-upload-preview">
                {form.imageUrl ? <img src={form.imageUrl} alt={form.name ? `${form.name} preview` : "Product preview"} /> : <small>No image uploaded</small>}
              </div>
              <label className={`button button-secondary button-full upload-button${saving || uploadingImage ? " is-disabled" : ""}`}>
                <input type="file" accept="image/*" disabled={saving || uploadingImage} onChange={(event) => void uploadProductImage(event)} />
                {uploadingImage ? "Uploading..." : form.imageUrl ? "Replace image" : "Upload image"}
              </label>
              {form.imageUrl && <button type="button" className="text-button" disabled={saving || uploadingImage} onClick={() => setForm({ ...form, imageUrl: "" })}>Remove image</button>}
            </div>
            <fieldset className="category-checks"><legend>Categories</legend>{categories.map((category) => <label key={category.id}><input type="checkbox" checked={form.categoryIds.includes(category.id)} onChange={(event) => setForm({ ...form, categoryIds: event.target.checked ? [...form.categoryIds, category.id] : form.categoryIds.filter((id) => id !== category.id) })} /><span>{category.name}</span></label>)}</fieldset>
            <button className="button button-primary button-full" disabled={saving || uploadingImage}>{saving ? "Saving…" : editingProductId ? "Update product" : "Create product"}</button>
          </form>
          <section className="admin-table-card">
            <div className="admin-card-head"><h2>Inventory</h2><span>{products.length} products</span></div>
            <div className="table-scroll"><table><thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Categories</th><th /></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><strong>{product.name}</strong><small>#{product.id}</small></td><td>{formatCurrency(product.price)}</td><td><span className={product.stockQuantity === 0 ? "table-stock is-out" : "table-stock"}>{product.stockQuantity}</span></td><td>{product.categories.map((category) => category.name).join(", ") || "—"}</td><td><div className="row-actions"><button onClick={() => editProduct(product)}>Edit</button><button className="danger-text" onClick={() => void removeProduct(product.id)}>Delete</button></div></td></tr>)}</tbody></table></div>
          </section>
        </div>
      )}

      {tab === "categories" && (
        <div className="admin-split category-admin">
          <form className="admin-form-card" onSubmit={saveCategory}><div className="admin-form-title"><div><p className="section-kicker">Taxonomy</p><h2>{editingCategoryId ? "Rename category" : "New category"}</h2></div></div><label className="form-field"><span>Category name</span><input maxLength={100} value={categoryName} onChange={(event) => setCategoryName(event.target.value)} /></label><button className="button button-primary button-full" disabled={saving}>{editingCategoryId ? "Save new name" : "Create category"}</button>{editingCategoryId && <button type="button" className="text-button" onClick={() => { setEditingCategoryId(null); setCategoryName(""); }}>Cancel edit</button>}</form>
          <section className="admin-table-card"><div className="admin-card-head"><h2>Categories</h2><span>{categories.length} total</span></div><div className="category-list">{categories.map((category) => <div key={category.id}><span><small>#{category.id}</small><strong>{category.name}</strong></span><span className="row-actions"><button onClick={() => { setEditingCategoryId(category.id); setCategoryName(category.name); }}>Rename</button><button className="danger-text" onClick={() => void removeCategory(category.id)}>Delete</button></span></div>)}</div></section>
        </div>
      )}

      {tab === "orders" && (
        <section className="admin-table-card"><div className="admin-card-head"><h2>All orders</h2><span>{orders.length} total</span></div><div className="table-scroll"><table><thead><tr><th>Order</th><th>Placed</th><th>Items</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><strong>#{order.id}</strong></td><td>{formatDate(order.createdAt)}</td><td>{order.totalItems}</td><td>{formatCurrency(order.totalAmount)}</td><td><select className={`status-select status-${order.status.toLowerCase()}`} value={order.status} onChange={(event) => void changeOrderStatus(order.id, event.target.value as OrderStatus)}>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div></section>
      )}
    </main>
  );
}
