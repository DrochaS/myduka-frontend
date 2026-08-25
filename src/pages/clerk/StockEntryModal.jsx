import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { createStockEntry } from '../../redux/slices/inventorySlice'
import { positiveNumber, required } from '../../utils/validators'

const EMPTY = {
  productName: '',
  quantityReceived: '',
  stockQuantity: '',
  spoiltQuantity: '0',
  buyingPrice: '',
  sellingPrice: '',
  paymentStatus: 'not_paid',
}

export default function StockEntryModal({ open, onClose, products = [] }) {
  const dispatch = useDispatch()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const next = {}
    const nameErr = required(form.productName, 'Product')
    if (nameErr) next.productName = nameErr
    ;[
      ['quantityReceived', 'Quantity received'],
      ['stockQuantity', 'Stock quantity'],
      ['spoiltQuantity', 'Spoilt quantity'],
      ['buyingPrice', 'Buying price'],
      ['sellingPrice', 'Selling price'],
    ].forEach(([key, label]) => {
      const err = positiveNumber(form[key], label)
      if (err) next[key] = err
    })
    return next
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setSubmitting(true)
    const result = await dispatch(
      createStockEntry({
        productName: form.productName,
        quantityReceived: Number(form.quantityReceived),
        stockQuantity: Number(form.stockQuantity),
        spoiltQuantity: Number(form.spoiltQuantity),
        buyingPrice: Number(form.buyingPrice),
        sellingPrice: Number(form.sellingPrice),
        paymentStatus: form.paymentStatus,
      }),
    )
    setSubmitting(false)

    if (createStockEntry.fulfilled.match(result)) {
      setForm(EMPTY)
      onClose()
    }
  }

  return (
    <Modal
      open={open}
      title="New stock entry"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="stock-entry-form" loading={submitting}>
            Save entry
          </Button>
        </>
      }
    >
      <form id="stock-entry-form" className="form-grid" onSubmit={onSubmit}>
        <label className="field">
          <span className="field__label">Product</span>
          <input
            list="product-options"
            className="field__input"
            name="productName"
            value={form.productName}
            onChange={onChange}
            placeholder="e.g. Maize flour 2kg"
          />
          <datalist id="product-options">
            {products.map((product) => (
              <option key={product.id || product.name} value={product.name} />
            ))}
          </datalist>
          {errors.productName ? (
            <span className="field__error">{errors.productName}</span>
          ) : null}
        </label>
        <Input
          label="Quantity received"
          name="quantityReceived"
          type="number"
          min="0"
          value={form.quantityReceived}
          onChange={onChange}
          error={errors.quantityReceived}
        />
        <Input
          label="Stock quantity"
          name="stockQuantity"
          type="number"
          min="0"
          value={form.stockQuantity}
          onChange={onChange}
          error={errors.stockQuantity}
        />
        <Input
          label="Spoilt quantity"
          name="spoiltQuantity"
          type="number"
          min="0"
          value={form.spoiltQuantity}
          onChange={onChange}
          error={errors.spoiltQuantity}
        />
        <Input
          label="Buying price"
          name="buyingPrice"
          type="number"
          min="0"
          value={form.buyingPrice}
          onChange={onChange}
          error={errors.buyingPrice}
        />
        <Input
          label="Selling price"
          name="sellingPrice"
          type="number"
          min="0"
          value={form.sellingPrice}
          onChange={onChange}
          error={errors.sellingPrice}
        />
        <label className="field">
          <span className="field__label">Payment status</span>
          <select
            className="field__input"
            name="paymentStatus"
            value={form.paymentStatus}
            onChange={onChange}
          >
            <option value="paid">Paid</option>
            <option value="not_paid">Not paid</option>
          </select>
        </label>
      </form>
    </Modal>
  )
}
