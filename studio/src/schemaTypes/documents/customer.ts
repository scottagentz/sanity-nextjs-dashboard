import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'

export const customer = defineType({
  name: 'customer',
  title: 'Customer',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'The customer\'s full name',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'workTitle',
      title: 'Work Title',
      type: 'string',
      description: 'The customer\'s job title or profession',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
      description: 'The customer\'s address',
    }),
    defineField({
      name: 'personalInterests',
      title: 'Personal Interests',
      type: 'array',
      of: [
        {
          type: 'string',
          title: 'Interest',
        },
      ],
      description: 'List of the customer\'s personal interests and hobbies',
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      description: 'Customer\'s profile photo',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'workTitle',
      media: 'profileImage',
    },
  },
}) 