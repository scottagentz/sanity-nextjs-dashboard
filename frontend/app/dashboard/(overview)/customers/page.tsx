import { client } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/utils'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Customers',
  description: 'Landing page for all customers',
}

// No caching, fetch on every request
async function getCustomers() {
  const query = `*[_type == "customer"] {
    _id,
    name,
    address,
    workTitle,
    personalInterests,
    profileImage
  }`
  return client.fetch(query, {}, { next: { revalidate: 3600 } })
}

export default async function CustomersPage() {
  const customers = await getCustomers()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Customers</h1>
      <p className="text-gray-600">
        Browse the list of customers, along with their details and personal interests.
      </p>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {customers.map((customer: any) => {
          // Generate image URL safely
          let imageUrl = null
          if (customer.profileImage) {
            try {
              const url = urlForImage(customer.profileImage)?.url()
              // Only use the URL if it's not empty and is a valid string
              if (url && typeof url === 'string' && url.trim() !== '') {
                imageUrl = url
              }
            } catch (error) {
              console.error('Error generating image URL for customer:', customer.name, error)
            }
          }

          return (
            <div
              key={customer._id}
              className="rounded-md border border-gray-200 bg-white p-4 shadow-sm"
            >
              {(() => {
                const imageUrl = customer.profileImage ? urlForImage(customer.profileImage)?.url() : null
                return imageUrl && imageUrl !== '' ? (
                  <div className="mb-4">
                    <Image
                      src={imageUrl}
                      alt={customer.name || 'Customer'}
                      width={80}
                      height={80}
                      className="rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
                    <span className="text-sm text-gray-500">
                      {customer.name ? customer.name.charAt(0).toUpperCase() : '?'}
                    </span>
                  </div>
                )
              })()}

              <h2 className="text-lg font-semibold">{customer.name}</h2>
              {customer.workTitle && (
                <p className="text-sm text-gray-500">{customer.workTitle}</p>
              )}
              
              {customer.address && (
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Address:</span> {customer.address}
                </p>
              )}

              {customer.personalInterests?.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium text-sm text-gray-600">Interests:</p>
                  <ul className="list-inside list-disc pl-4 text-sm text-gray-600">
                    {customer.personalInterests.map((interest: string) => (
                      <li key={interest}>{interest}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
} 