import { Link } from "react-router-dom";
import type { Product } from "../../types";
import { formatCurrency } from "../../utils/format";
import { ProductVisual } from "./ProductVisual";

export function ProductCard({ product }: { product: Product }) {
  const categories = Array.isArray(product.categories) ? product.categories : [];
  const productName = typeof product.name === "string" && product.name.trim()
    ? product.name
    : "Unnamed product";
  const productId = Number.isInteger(product.id) && product.id > 0 ? product.id : 0;
  const productPath = productId > 0 ? `/products/${productId}` : "/catalog";
  const stockQuantity = Number.isFinite(product.stockQuantity)
    ? Math.max(0, Math.trunc(product.stockQuantity))
    : 0;

  return (
    <article className="catalog-card">
      <Link to={productPath} className="catalog-card-media">
        <ProductVisual imageUrl={product.imageUrl} name={productName} />
        <span className={`stock-chip ${stockQuantity === 0 ? "is-out" : ""}`}>
          {stockQuantity === 0 ? "Sold out" : `${stockQuantity} in stock`}
        </span>
      </Link>
      <div className="catalog-card-body">
        <p className="catalog-card-kicker">
          {categories.map((category) => category?.name).filter(Boolean).join(" · ") || "Uncategorized"}
        </p>
        <div className="catalog-card-title-row">
          <Link to={productPath}>{productName}</Link>
          <strong>{formatCurrency(product.price)}</strong>
        </div>
      </div>
    </article>
  );
}
