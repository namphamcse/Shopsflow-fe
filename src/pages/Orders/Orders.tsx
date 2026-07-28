import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../../api/storeApi";
import { EmptyState } from "../../components/common/EmptyState";
import { Loading } from "../../components/common/Loading";
import type { Order } from "../../types";
import { formatCurrency, formatDate } from "../../utils/format";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrders()
      .then((data) => setOrders([...data].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))))
      .catch(() => setError("Could not load your order history."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <main className="page-shell"><Loading label="Loading orders" /></main>;
  if (error) return <main className="page-shell"><EmptyState title="Orders unavailable" description={error} /></main>;
  if (orders.length === 0) return <main className="page-shell"><EmptyState title="No orders yet" description="Once you complete checkout, your order history and status will appear here." action={<Link className="button button-primary" to="/catalog">Start shopping</Link>} /></main>;

  return (
    <main className="page-shell">
      <header className="page-heading compact-heading"><div><p className="section-kicker">Account / History</p><h1>Your orders.</h1></div><p>Track status and review every item in your previous checkouts.</p></header>
      <section className="order-list">
        {orders.map((order) => (
          <article className="order-card" key={order.id}>
            <header className="order-card-head">
              <div><span>Order</span><strong>#{order.id}</strong></div>
              <div><span>Placed</span><strong>{formatDate(order.createdAt)}</strong></div>
              <div><span>Total</span><strong>{formatCurrency(order.totalAmount)}</strong></div>
              <span className={`status-pill status-${order.status.toLowerCase()}`}>{order.status}</span>
            </header>
            <div className="order-lines">
              {order.items.map((item) => (
                <div className="order-line" key={`${order.id}-${item.productId}`}>
                  <div><Link to={`/products/${item.productId}`}>{item.productName}</Link><span>{item.quantity} × {formatCurrency(item.priceAtPurchase)}</span></div>
                  <strong>{formatCurrency(item.subtotal)}</strong>
                </div>
              ))}
            </div>
            <footer className="order-card-foot"><span>{order.totalItems} item{order.totalItems === 1 ? "" : "s"}</span><span>{order.status === "PENDING" ? "Your order has been received." : order.status === "PAID" ? "Payment confirmed." : order.status === "SHIPPED" ? "Your order is on its way." : order.status === "DELIVERED" ? "Delivered successfully." : "This order was cancelled."}</span></footer>
          </article>
        ))}
      </section>
    </main>
  );
}
