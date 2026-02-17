import React, { useState } from 'react'
import { submitFeedback } from '../services/api'

export default function OutfitCard({ outfit }){
  const [feedbackStatus, setFeedbackStatus] = useState(null)
  const [showFull, setShowFull] = useState(false)

  async function sendFeedback(liked){
    try{
      await submitFeedback({ outfit_id: outfit.id, liked })
      setFeedbackStatus(liked ? 'liked' : 'disliked')
    }catch(err){
      console.error('feedback error', err)
      const status = err?.response?.status
      if(status === 401){
        setFeedbackStatus('login_required')
      } else {
        setFeedbackStatus('error')
      }
    }
  }

  return (
    <div className="border p-4 rounded">
      <h3 className="font-semibold">Outfit #{outfit.id}</h3>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {outfit.items.map(it => (
          <img key={it.id} src={it.image_url} alt={it.category} className="w-full h-24 object-cover" />
        ))}
      </div>
      <p className="mt-2 text-sm text-gray-600">
        {outfit.reason}
        {outfit.reason_full && !showFull && outfit.reason_full.length > outfit.reason.length && (
          <button onClick={()=>setShowFull(true)} className="ml-2 text-blue-600 underline text-sm">Read more</button>
        )}
        {showFull && outfit.reason_full && (
          <span>
            {' '}{outfit.reason_full}
            <button onClick={()=>setShowFull(false)} className="ml-2 text-blue-600 underline text-sm">Show less</button>
          </span>
        )}
      </p>
      <div className="mt-3 flex gap-2">
        <button onClick={()=>sendFeedback(true)} disabled={feedbackStatus} className="btn">Like</button>
        <button onClick={()=>sendFeedback(false)} disabled={feedbackStatus} className="btn">Dislike</button>
        {feedbackStatus === 'login_required' && <div className="ml-3 text-sm text-yellow-600">Please log in to submit feedback.</div>}
        {feedbackStatus === 'error' && <div className="ml-3 text-sm text-red-600">Feedback failed — try again.</div>}
        {feedbackStatus === 'liked' && <div className="ml-3 text-sm">You liked this outfit</div>}
        {feedbackStatus === 'disliked' && <div className="ml-3 text-sm">You disliked this outfit</div>}
      </div>
    </div>
  )
}
