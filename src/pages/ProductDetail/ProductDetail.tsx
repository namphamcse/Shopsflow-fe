import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../api/client";
import {
  addToCart,
  createReview,
  deleteReview,
  getProduct,
  getProductReviews,
  updateReview,
} from "../../api/storeApi";
import { EmptyState } from "../../components/common/EmptyState";
import { Loading } from "../../components/common/Loading";
import { ProductVisual } from "../../components/common/ProductVisual";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import type { Product, Review } from "../../types";
import { formatCurrency, formatDate } from "../../utils/format";

export default function ProductDetail() {
  const { id } = useParams();
  const productId = Number(id);
  const hasValidProductId = Number.isInteger(productId) && productId > 0;
  const [product, setProduct] = useState<Product | null>(null);
  const [loadedProductId, setLoadedProductId] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(hasValidProductId);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewSaving, setReviewSaving] = useState(false);
  const { isLoggedIn, user } = useAuth();
  const { setCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const ownReview = reviews.find((review) => review.userId === user?.id);
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length;
  }, [reviews]);

  useEffect(() => {
    const controller = new AbortController();

    queueMicrotask(() => {
      if (controller.signal.aborted) return;
      setProduct(null);
      setLoadedProductId(null);
      setReviews([]);
      setLoading(hasValidProductId);
      setQuantity(1);
      setStars(5);
      setComment("");
      setAdding(false);
      setReviewSaving(false);
    });

    if (!hasValidProductId) {
      return () => {
        controller.abort();
      };
    }

    Promise.all([
      getProduct(productId, controller.signal),
      getProductReviews(productId, controller.signal),
    ])
      .then(([productData, reviewData]) => {
        if (controller.signal.aborted) return;
        setProduct(productData);
        setLoadedProductId(productId);
        setReviews(Array.isArray(reviewData) ? reviewData : []);
        setQuantity(productData.stockQuantity > 0 ? 1 : 0);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setProduct(null);
          setLoadedProductId(null);
          setReviews([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [hasValidProductId, productId]);

  useEffect(() => {
    let cancelled = false;
    const existingReview = reviews.find((review) => review.userId === user?.id);
    queueMicrotask(() => {
      if (cancelled) return;
      setStars(existingReview?.stars ?? 5);
      setComment(existingReview?.comment ?? "");
    });
    return () => { cancelled = true; };
  }, [reviews, user?.id]);

  async function handleAddToCart() {
    if (!product || product.stockQuantity <= 0) return;
    if (!isLoggedIn) {
      navigate("/login", { state: { from: location } });
      return;
    }

    const safeQuantity = Math.min(Math.max(1, quantity), product.stockQuantity);
    setAdding(true);
    try {
      const cart = await addToCart(product.id, safeQuantity);
      setCart(cart);
      toast.success(`${product.name} added to your cart.`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not add this product."));
    } finally {
      setAdding(false);
    }
  }

  async function handleReviewSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!product || !user) return;

    setReviewSaving(true);
    try {
      const saved = ownReview
        ? await updateReview(ownReview.id, stars, comment.trim())
        : await createReview(product.id, stars, comment.trim());
      setReviews((current) =>
        ownReview
          ? current.map((review) => (review.id === saved.id ? saved : review))
          : [saved, ...current],
      );
      toast.success(ownReview ? "Review updated." : "Review published.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not save your review."));
    } finally {
      setReviewSaving(false);
    }
  }

  async function handleDeleteReview() {
    if (!ownReview) return;

    setReviewSaving(true);
    try {
      await deleteReview(ownReview.id);
      setReviews((current) => current.filter((review) => review.id !== ownReview.id));
      setStars(5);
      setComment("");
      toast.success("Review deleted.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not delete your review."));
    } finally {
      setReviewSaving(false);
    }
  }

  if (!hasValidProductId) {
    return (
      <main className="page-shell">
        <EmptyState
          title="Product not found"
          description="This object may have been removed or the link is incorrect."
          action={<Link className="button button-primary" to="/catalog">Back to catalog</Link>}
        />
      </main>
    );
  }

  if (loading || loadedProductId !== productId) {
    return <main className="page-shell"><Loading label="Loading product" /></main>;
  }

  if (!product) {
    return (
      <main className="page-shell">
        <EmptyState
          title="Product not found"
          description="This object may have been removed or the link is incorrect."
          action={<Link className="button button-primary" to="/catalog">Back to catalog</Link>}
        />
      </main>
    );
  }

  const maxSelectableQuantity = Math.min(Math.max(product.stockQuantity, 0), 10);

  return (
    <main className="page-shell">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/catalog">Catalog</Link><span>/</span><span>{product.name}</span>
      </nav>

      <section className="product-detail-grid">
        <div className="product-detail-media"><ProductVisual imageUrl={product.imageUrl} name={product.name} /></div>
        <div className="product-detail-copy">
          <p className="section-kicker">{product.categories.map((category) => category.name).join(" / ") || "Uncategorized"}</p>
          <h1>{product.name}</h1>
          <div className="product-rating-row">
            <span className="star-line">{"★".repeat(Math.round(averageRating))}{"☆".repeat(5 - Math.round(averageRating))}</span>
            <a href="#reviews">{reviews.length ? `${averageRating.toFixed(1)} from ${reviews.length} review${reviews.length === 1 ? "" : "s"}` : "No reviews yet"}</a>
          </div>
          <strong className="product-price">{formatCurrency(product.price)}</strong>
          <p className="product-description">{product.description || "A considered object from the Shopsflow catalog. Full specifications will be added shortly."}</p>

          <div className="stock-line">
            <span className={product.stockQuantity > 0 ? "stock-dot" : "stock-dot is-out"} />
            {product.stockQuantity > 0 ? `${product.stockQuantity} available and ready to ship` : "Currently out of stock"}
          </div>

          <div className="purchase-row">
            <label className="quantity-field">
              <span>Quantity</span>
              <select value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} disabled={product.stockQuantity === 0}>
                {Array.from({ length: maxSelectableQuantity }, (_, index) => index + 1).map((value) => <option value={value} key={value}>{value}</option>)}
              </select>
            </label>
            <button className="button button-primary purchase-button" type="button" onClick={handleAddToCart} disabled={adding || product.stockQuantity === 0}>
              {adding ? "Adding…" : product.stockQuantity === 0 ? "Sold out" : "Add to cart"}
            </button>
          </div>

          <dl className="product-service-list">
            <div><dt>Delivery</dt><dd>Free over $80. Calculated at checkout.</dd></div>
            <div><dt>Returns</dt><dd>30 days, with original packaging.</dd></div>
            <div><dt>Support</dt><dd>Human help for every order.</dd></div>
          </dl>
        </div>
      </section>

      <section className="reviews-section" id="reviews">
        <div className="section-heading">
          <div><p className="section-kicker">Customer notes</p><h2>Reviews ({reviews.length})</h2></div>
          {reviews.length > 0 && <div className="rating-summary"><strong>{averageRating.toFixed(1)}</strong><span>{"★".repeat(Math.round(averageRating))}{"☆".repeat(5 - Math.round(averageRating))}</span></div>}
        </div>

        <div className="reviews-layout">
          <div className="review-list">
            {reviews.length === 0 ? <div className="inline-notice">No review has been published yet. Be the first to share a useful note.</div> : reviews.map((review) => (
              <article className="review-card" key={review.id}>
                <div className="review-card-head">
                  <div><strong>{review.userName || "Customer"}</strong><span>{formatDate(review.createdAt)}</span></div>
                  <span className="star-line">{"★".repeat(review.stars)}{"☆".repeat(5 - review.stars)}</span>
                </div>
                <p>{review.comment || "No written comment."}</p>
              </article>
            ))}
          </div>

          <aside className="review-form-card">
            {isLoggedIn ? (
              <form onSubmit={handleReviewSubmit}>
                <h3>{ownReview ? "Edit your review" : "Write a review"}</h3>
                <p>Keep it specific: build, comfort, performance and long-term use are most helpful.</p>
                <label className="form-field"><span>Rating</span><select value={stars} onChange={(event) => setStars(Number(event.target.value))}>{[5,4,3,2,1].map((value) => <option key={value} value={value}>{value} star{value === 1 ? "" : "s"}</option>)}</select></label>
                <label className="form-field"><span>Comment</span><textarea rows={5} maxLength={2000} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="What should another customer know?" /></label>
                <button className="button button-primary button-full" disabled={reviewSaving}>{reviewSaving ? "Saving…" : ownReview ? "Update review" : "Publish review"}</button>
                {ownReview && <button className="text-button danger-text" type="button" disabled={reviewSaving} onClick={() => void handleDeleteReview()}>Delete my review</button>}
              </form>
            ) : (
              <div><h3>Share your experience</h3><p>Sign in to write a verified customer review.</p><Link className="button button-primary button-full" to="/login" state={{ from: location }}>Sign in to review</Link></div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
