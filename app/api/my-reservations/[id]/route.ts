import { NextResponse } from 'next/server'

/** User payment-proof upload is disabled; reservations are approved by admin only. */
export async function PATCH() {
  return NextResponse.json(
    { error: 'رفع إثبات الدفع غير متاح. انتظر موافقة الإدارة على طلبك.' },
    { status: 403 }
  )
}
