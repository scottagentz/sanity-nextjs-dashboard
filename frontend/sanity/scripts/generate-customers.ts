import { client } from '../lib/sanity.client'
import { createClient } from 'next-sanity'
import fs from 'fs'
import path from 'path'
import https from 'https'
import { projectId, dataset, apiVersion } from '../env'

// Create a write client
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// Sample customer data with image URLs
const customers = [
  {
    _type: 'customer',
    name: 'John Smith',
    address1: '123 Main St',
    address2: 'Apt 4B',
    city: 'Anytown',
    state: 'CA',
    zip: '90210',
    workTitle: 'Software Engineer',
    personalInterests: ['Hiking', 'Photography', 'Cooking'],
    imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    _type: 'customer',
    name: 'Emily Johnson',
    address1: '456 Oak Ave',
    address2: '',
    city: 'Somewhere',
    state: 'NY',
    zip: '10001',
    workTitle: 'Marketing Director',
    personalInterests: ['Yoga', 'Reading', 'Travel'],
    imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    _type: 'customer',
    name: 'Michael Brown',
    address1: '789 Pine Rd',
    address2: 'Suite 200',
    city: 'Nowhere',
    state: 'TX',
    zip: '75001',
    workTitle: 'Data Scientist',
    personalInterests: ['Gaming', 'Music', 'Fitness'],
    imageUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
  {
    _type: 'customer',
    name: 'Sarah Davis',
    address1: '321 Elm St',
    address2: '',
    city: 'Everywhere',
    state: 'FL',
    zip: '33101',
    workTitle: 'UX Designer',
    personalInterests: ['Art', 'Dancing', 'Writing'],
    imageUrl: 'https://randomuser.me/api/portraits/women/4.jpg',
  },
  {
    _type: 'customer',
    name: 'David Wilson',
    address1: '654 Maple Dr',
    address2: 'Unit 5',
    city: 'Anywhere',
    state: 'WA',
    zip: '98101',
    workTitle: 'Product Manager',
    personalInterests: ['Skiing', 'Chess', 'Gardening'],
    imageUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
]

// Function to download an image from a URL
async function downloadImage(url: string, filepath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', () => resolve(filepath))
      } else {
        response.resume()
        reject(new Error(`Request Failed With a Status Code: ${response.statusCode}`))
      }
    })
  })
}

// Function to upload an image to Sanity
async function uploadImageToSanity(imagePath: string): Promise<string> {
  try {
    const imageAsset = await writeClient.assets.upload('image', fs.createReadStream(imagePath));
    console.log(`Uploaded image: ${imageAsset._id}`);
    return imageAsset._id;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

interface CustomerData {
  _type: string
  name: string
  address1: string
  address2: string
  city: string
  state: string
  zip: string
  workTitle: string
  personalInterests: string[]
  imageUrl: string
}

interface CustomerWithImage extends Omit<CustomerData, 'imageUrl'> {
  profileImage: {
    _type: string
    asset: {
      _type: string
      _ref: string
    }
  }
}

// Function to create a customer with an image
async function createCustomerWithImage(customerData: CustomerData): Promise<any> {
  try {
    // Create a temporary directory for downloaded images
    const tempDir = path.join(process.cwd(), 'temp')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir)
    }

    // Download the image
    const imagePath = path.join(tempDir, `${customerData.name.replace(/\s+/g, '-').toLowerCase()}.jpg`)
    await downloadImage(customerData.imageUrl, imagePath)

    // Upload the image to Sanity
    const imageAssetId = await uploadImageToSanity(imagePath)

    // Create the customer with the image reference
    const customerWithImage: CustomerWithImage = {
      ...customerData,
      profileImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAssetId,
        },
      },
    }

    // Remove the imageUrl property as it's not part of the schema
    const { imageUrl, ...customerWithoutImage } = customerWithImage as any

    // Create the customer
    const result = await writeClient.create(customerWithoutImage)
    console.log(`Created customer: ${result.name} with ID: ${result._id}`)

    // Clean up the temporary file
    fs.unlinkSync(imagePath)

    return result
  } catch (error) {
    console.error(`Error creating customer ${customerData.name}:`, error)
    throw error
  }
}

// Function to create all customers
async function createAllCustomers(): Promise<void> {
  console.log('Starting to create customers with images...')
  
  for (const customer of customers) {
    await createCustomerWithImage(customer)
  }
  
  console.log('All customers created successfully!')
  
  // Clean up the temporary directory
  const tempDir = path.join(process.cwd(), 'temp')
  if (fs.existsSync(tempDir)) {
    fs.rmdirSync(tempDir)
  }
}

// Run the function
createAllCustomers().catch(error => {
  console.error('Error creating customers:', error)
}) 