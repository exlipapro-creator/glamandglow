import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center container-luxe text-center">
      <p className="font-serif text-8xl font-semibold text-charcoal-800/10 mb-4">404</p>
      <h1 className="font-serif text-2xl text-charcoal-800 mb-3">Page not found</h1>
      <p className="text-sm text-charcoal-800/50 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  )
}
