import { DEFAULT_PET_IMAGE_URL } from '@/config/constants';
import z from 'zod';

// - Using Zod schema so we can apply the same validation both client and server side
// - Note we need to install both zod and @hookform/resolvers packages for this to work
// - Also note using z.union below instead of z.optional (e.g. z.string().optional())
// for imageUrl and notes fields because using optional results in an inferred type of string | undefined
// and we'd prefer to have an inferred type of string for easier handling later on
// - Also note that we specify the generic z.coerce.number<number>() for the age field
// because there's an issue with Zod 4 and react hook form resolver, if we don't do this
// the inferred type for coerced fields looks like unknown to react hook form resolver
// but the inferred type in Zod remains correct (number in this case) and then typescript
// complains about the mismatch. See https://github.com/colinhacks/zod/issues/5010
// - Also note the use of the transform method to make sure that if we get an empty string
// for imageUrl, it is converted to the default URL, however we're using getValues() in pet-form.tsx
// to get the form data which is the form data before transformation although after validation,so
// all transformations are done server side including default image URL and trimming strings.
// Its applied to action handlers in actions.ts
export const petFormSchema = z
  .object({
    name: z.string().min(1, 'Pet name is required').max(100),
    ownerName: z
      .string()
      .trim()
      .min(1, 'Owner name is required')
      .max(100, 'Owner name is maximum 100 characters'),
    imageUrl: z.union([z.url('Image URL must be a valid URL'), z.literal('')]),
    age: z.coerce
      .number<number>()
      .int()
      .positive()
      .max(30, 'Age seems too high'),
    notes: z.union([z.string().trim().max(1000), z.literal('')]),
  })
  .transform((data) => ({
    ...data,
    imageUrl: data.imageUrl || DEFAULT_PET_IMAGE_URL,
  }));

export type TPetForm = z.infer<typeof petFormSchema>;

// should use a library to convert the prisma model id type to a zod schema
// so that if it changes we only have to change it in one place, but for now we'll define it manually
export const petIdSchema = z.cuid('Invalid pet ID');

export const authSchema = z.object({
  email: z.email().max(100),
  password: z.string().max(100)
})