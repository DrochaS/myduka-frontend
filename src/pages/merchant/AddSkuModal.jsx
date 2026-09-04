import { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import Button from '../../components/common/Button'
import './AddSkuModal.css'

export default function AddSkuModal({ open, onClose, onCreated }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [sku, setSku] = useState('')
  const [storeId, setStoreId] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [buyPrice, setBuyPrice] = useState('')
  const [sellPrice, setSellPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [stores, setStores] = useState([])
  const [storesLoading, setStoresLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open) return
    setName('')
    setCategory('')
    setSku('')
    setStoreId('')
    setImageUrl('')
    setBuyPrice('')
    setSellPrice('')
    setQuantity('')
    setError(null)

    setStoresLoading(true)
    axiosInstance
      .get('/merchant/stores')
      .then((res) => setStores(res.data || []))
      .catch(() => setStores([]))
      .finally(() => setStoresLoading(false))
  }, [open])

  if (!open) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await axiosInstance.post('/merchant/products', {
        name: name.trim(),
        category: category.trim() || undefined,
        sku: sku.trim() || undefined,
        image_url: imageUrl.trim() || undefined,
        store_id: Number(storeId),
        buy_price: buyPrice ? Number(buyPrice) : undefined,
        sell_price: sellPrice ? Number(sellPrice) : undefined,
        quantity_in_stock: quantity ? Number(quantity) : undefined,
      })
      onCreated?.(res.data)
      onClose()
    } catch (err) {
      const details = err.response?.data
      setError(
        details?.details
          ? Object.values(details.details).flat().join(' ')
          : details?.error || 'Something went wrong adding the SKU.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="sku-modal-backdrop" onClick={onClose}>
      <div className="sku-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sku-modal__header">
          <h2>Add SKU</h2>
          <button className="sku-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="sku-modal__form">
          {error && <div className="sku-modal__error">{error}</div>}

          <label className="sku-modal__field">
            <span>Product name *</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tusker Lager 500ml"
            />
          </label>

          <label className="sku-modal__field">
            <span>Branch *</span>
            <select
              required
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              disabled={storesLoading}
            >
              <option value="" disabled>
                Select a branch
              </option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>

          <label className="sku-modal__field">
            <span>Image URL</span>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/product.jpg"
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                className="sku-modal__image-preview"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
                onLoad={(e) => { e.currentTarget.style.display = 'block' }}
              />
            )}
          </label>

          <div className="sku-modal__row">
            <label className="sku-modal__field">
              <span>Category</span>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Beverages"
              />
            </label>
            <label className="sku-modal__field">
              <span>SKU code</span>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="TUS-500"
              />
            </label>
          </div>

          <div className="sku-modal__row">
            <label className="sku-modal__field">
              <span>Buy price</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                placeholder="0.00"
              />
            </label>
            <label className="sku-modal__field">
              <span>Sell price</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                placeholder="0.00"
              />
            </label>
          </div>

          <label className="sku-modal__field">
            <span>Starting quantity</span>
            <input
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
            />
          </label>

          <div className="sku-modal__actions">
            <Button variant="secondary" type="button" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Add SKU
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}