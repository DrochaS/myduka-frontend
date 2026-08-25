import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { createSupplyRequest } from '../../redux/slices/requestSlice'
import { positiveNumber, required } from '../../utils/validators'

const EMPTY = {
  productName: '',
  quantity: '',
  notes: '',
}

export default function RequestSupplyModal({ open, onClose }) {
  const dispatch = useDispatch()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const next = {}
    const nameErr = required(form.productName, 'Product')
    const qtyErr = positiveNumber(form.quantity, 'Quantity')
    if (nameErr) next.productName = nameErr
    if (qtyErr) next.quantity = qtyErr
    if (Number(form.quantity) <= 0) next.quantity = 'Quantity must be greater than 0'
    setErrors(next)
    if (Object.keys(next).length) return

    setSubmitting(true)
    const result = await dispatch(
      createSupplyRequest({
        productName: form.productName,
        quantity: Number(form.quantity),
        notes: form.notes,
      }),
    )
    setSubmitting(false)

    if (createSupplyRequest.fulfilled.match(result)) {
      setForm(EMPTY)
      onClose()
    }
  }

  return (
    <Modal
      open={open}
      title="Request supply"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="request-supply-form" loading={submitting}>
            Submit request
          </Button>
        </>
      }
    >
      <form id="request-supply-form" className="form-grid" onSubmit={onSubmit}>
        <Input
          label="Product"
          name="productName"
          value={form.productName}
          onChange={onChange}
          error={errors.productName}
        />
        <Input
          label="Quantity needed"
          name="quantity"
          type="number"
          min="1"
          value={form.quantity}
          onChange={onChange}
          error={errors.quantity}
        />
        <label className="field">
          <span className="field__label">Notes</span>
          <textarea
            className="field__input"
            name="notes"
            rows="3"
            value={form.notes}
            onChange={onChange}
            placeholder="Optional context for the admin"
          />
        </label>
      </form>
    </Modal>
  )
}
