import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { reportSpoiltGoods } from '../../redux/slices/inventorySlice'
import { positiveNumber } from '../../utils/validators'

export default function SpoiltGoodsModal({ open, onClose, entry }) {
  const dispatch = useDispatch()
  const [spoiltQuantity, setSpoiltQuantity] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open && entry) {
      setSpoiltQuantity(String(entry.spoiltQuantity || ''))
      setReason('')
      setError(null)
    }
  }, [open, entry])

  const onSubmit = async (event) => {
    event.preventDefault()
    const qtyErr = positiveNumber(spoiltQuantity, 'Spoilt quantity')
    if (qtyErr) {
      setError(qtyErr)
      return
    }
    if (!entry?.id) {
      setError('Select a stock entry first.')
      return
    }

    setSubmitting(true)
    const result = await dispatch(
      reportSpoiltGoods({
        stockEntryId: entry.id,
        spoiltQuantity: Number(spoiltQuantity),
        reason,
      }),
    )
    setSubmitting(false)

    if (reportSpoiltGoods.fulfilled.match(result)) {
      onClose()
    }
  }

  return (
    <Modal
      open={open}
      title="Report spoilt goods"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="spoilt-goods-form" loading={submitting}>
            Save spoilt report
          </Button>
        </>
      }
    >
      <form id="spoilt-goods-form" className="form-grid" onSubmit={onSubmit}>
        <p>
          Product: <strong>{entry?.productName || '—'}</strong>
        </p>
        <Input
          label="Spoilt quantity"
          name="spoiltQuantity"
          type="number"
          min="0"
          value={spoiltQuantity}
          onChange={(event) => setSpoiltQuantity(event.target.value)}
          error={error}
        />
        <label className="field">
          <span className="field__label">Reason</span>
          <textarea
            className="field__input"
            name="reason"
            rows="3"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Damage, expiry, etc."
          />
        </label>
      </form>
    </Modal>
  )
}
