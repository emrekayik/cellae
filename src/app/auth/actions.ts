'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema, signUpSchema } from '@/lib/validations/auth'

export async function loginAction(formData: FormData) {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const validation = loginSchema.safeParse(rawData)
  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }

  const { email, password } = validation.data

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/app')
}

export async function signupAction(formData: FormData) {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
    username: formData.get('username'),
    fullName: formData.get('fullName'),
    age: formData.get('age'),
    gender: formData.get('gender') || undefined,
  }

  const validation = signUpSchema.safeParse(rawData)
  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }

  const { email, password, username, fullName, age, gender } = validation.data

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username || undefined,
        full_name: fullName || undefined,
        age: age || undefined,
        gender: gender || undefined,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/app')
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
