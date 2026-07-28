import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../api/client";
import { placeOrder, removeCartItem, updateCartItem } from "../../api/storeApi";
import { EmptyState } from "../../components/common/EmptyState";
import { Loading } from "../../components/common/Loading";
import { ProductVisual } from "../../components/common/ProductVisual";
import { useCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/format";

export default function Cart() {
  const { cart, isLoading, setCart } = useCart();
  const [busyItem, setBusyItem] = useState<number | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();
  const hasLegacyItems = cart.items.some((item) => item.itemId === null);

  async function changeQuantity(itemId: number | null, quantity: number) {
    if (itemId === null) {
      toast.error("The backend response is missing itemId for this cart item.");
      return;
    }

    setBusyItem(itemId);
    try {
      setCart(await updateCartItem(itemId, quantity));
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not update the quantity."));
    } finally {
      setBusyItem(null);
    }
  }

  async function removeItem(itemId: number | null) {
    if (itemId === null) {
      toast.error("The backend response is missing itemId for this cart item.");
      return;
    }

    setBusyItem(itemId);
    try {
      setCart(await removeCartItem(itemId));
      toast.success("Item removed from cart.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not remove this item."));
    } finally {
      setBusyItem(null);
    }
  }

  async function checkout() {
    setCheckingOut(true);
    try {
      const order = await placeOrder();
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
      toast.success(`Order #${order.id} placed successfully.`);
      navigate("/orders");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not place your order."));
    } finally {
      setCheckingOut(false);
    }
  }

  if (isLoading) return <main className="page-shell"><Loading label="Loading your cart" /></main>;
  if (cart.items.length === 0) return <main className="page-shell"><EmptyState title="Your cart is empty" description="The catalog is ready when you are. Add an object and it will appear here." action={<Link className="button button-primary" to="/catalog">Browse catalog</Link>} /></main>;

  return (
    <main className="page-shell">
      <header className="page-heading compact-heading"><div><p className="section-kicker">Your selection</p><h1>Shopping cart.</h1></div><p>{cart.totalItems} item{cart.totalItems === 1 ? "" : "s"} reserved for checkout.</p></header>
      {hasLegacyItems && (
        <div className="compatibility-notice" role="status">
          Your backend cart response is missing <code>itemId</code>. The products remain visible, but quantity and remove controls are disabled until <code>CartItemResponse</code> and <code>CartMapper</code> return that field.
        </div>
      )}
      <div className="cart-layout">
        <section className="cart-items">
          {cart.items.map((item, index) => {
            const canChangeQuantity = item.itemId !== null && item.stockQuantity !== null;
            const maxQuantity = item.stockQuantity === null
              ? item.quantity
              : Math.max(item.quantity, Math.min(item.stockQuantity, 20));

            return (
              <article className="cart-item" key={item.itemId ?? `${item.productId}-${index}`}>
                <Link className="cart-item-media" to={`/products/${item.productId}`}><ProductVisual imageUrl={item.imageUrl} name={item.productName} /></Link>
                <div className="cart-item-copy">
                  <div><Link to={`/products/${item.productId}`}><h2>{item.productName}</h2></Link><span>{formatCurrency(item.unitPrice)} each</span></div>
                  <label className="quantity-field">
                    <span>Qty</span>
                    <select
                      disabled={!canChangeQuantity || busyItem === item.itemId}
                      value={item.quantity}
                      onChange={(event) => void changeQuantity(item.itemId, Number(event.target.value))}
                      title={canChangeQuantity ? "Change quantity" : "Backend cart metadata is incomplete"}
                    >
                      {Array.from({ length: maxQuantity }, (_, optionIndex) => optionIndex + 1).map((value) => <option key={value} value={value}>{value}</option>)}
                    </select>
                  </label>
                  <strong>{formatCurrency(item.subtotal)}</strong>
                  <button
                    className="text-button danger-text"
                    disabled={item.itemId === null || busyItem === item.itemId}
                    onClick={() => void removeItem(item.itemId)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </section>
        <aside className="order-summary">
          <p className="section-kicker">Order summary</p>
          <dl><div><dt>Items</dt><dd>{cart.totalItems}</dd></div><div><dt>Subtotal</dt><dd>{formatCurrency(cart.totalPrice)}</dd></div><div><dt>Delivery</dt><dd>{cart.totalPrice >= 80 ? "Free" : "Calculated next"}</dd></div><div className="summary-total"><dt>Total</dt><dd>{formatCurrency(cart.totalPrice)}</dd></div></dl>
          <button className="button button-primary button-full" disabled={checkingOut} onClick={() => void checkout()}>{checkingOut ? "Placing order…" : "Place order"}</button>
          <p className="summary-note">By placing this order, you confirm the quantities and current delivery details associated with your account.</p>
          <Link className="text-link" to="/catalog">← Continue shopping</Link>
        </aside>
      </div>
    </main>
  );
}
