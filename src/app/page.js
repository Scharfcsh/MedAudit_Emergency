"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, CreditCard, Lock, CheckCircle } from "lucide-react"

export default function HomePage() {
  const [cardId, setCardId] = useState("")
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (cardId) {
      router.push(`/patient?card_id=${cardId}`)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative max-w-6xl mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          {/* Header Section */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              <Shield className="w-4 h-4" />
              HIPAA Compliant & Secure
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Emergency Medical
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Payment Portal
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Access your health details and process secure payments instantly. Enter your medical card ID to view your
              information and proceed with payment.
            </p>
          </div>

          {/* Main Card */}
          <div className="mt-12 max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 backdrop-blur-sm">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-6">
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Enter Your Card ID</h2>
              <p className="text-gray-600 mb-8">Your medical card ID will securely retrieve your health details</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    value={cardId}
                    onChange={(e) => setCardId(e.target.value)}
                    placeholder="Enter Medical Card ID"
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder-gray-400 text-gray-900 text-lg transition-all duration-200"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Access Health Details & Proceed
                </button>
              </form>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
              <Shield className="w-6 h-6 text-green-600" />
              <span className="text-gray-700 font-medium">256-bit SSL Encryption</span>
            </div>

            <div className="flex items-center justify-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-gray-700 font-medium">HIPAA Compliant</span>
            </div>

            <div className="flex items-center justify-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
              <Lock className="w-6 h-6 text-green-600" />
              <span className="text-gray-700 font-medium">Secure Payment Processing</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-semibold mb-4">Why Choose Our Portal?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-100">Instant Access</h4>
                <p className="text-blue-100">View your health details immediately upon card ID verification</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-100">Secure Payments</h4>
                <p className="text-blue-100">Process payments safely with bank-level security</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-100">24/7 Availability</h4>
                <p className="text-blue-100">Access your medical payment portal anytime, anywhere</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-100">Privacy Protected</h4>
                <p className="text-blue-100">Your medical information is encrypted and protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle, #e5e7eb 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </main>
  )
}
