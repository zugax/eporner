export const metadata = {
  title: 'Contact - AREA BOKEP',
  description: 'Contact information for AREA BOKEP'
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-white mb-4">Contact</h1>
      <p className="text-gray-400 mb-4">
        For general inquiries, bug reports, or content-related questions, please reach out to the site administrator.
      </p>
      <p className="text-gray-400">Email: <a href="mailto:admin@example.com" className="text-primary hover:text-primary-dark">admin@example.com</a></p>
    </div>
  )
}
