// $fetch wrapper for admin calls: surfaces the server's message and bounces to login on 401.
export function useAdminApi() {
  const error = ref('')
  const busy = ref(false)
  async function call<T>(url: string, opts: Parameters<typeof $fetch>[1] = {}): Promise<T | undefined> {
    error.value = ''
    busy.value = true
    try {
      return await $fetch<T>(url, opts as any)
    }
    catch (e: any) {
      if (e?.statusCode === 401) return void navigateTo('/admin/login')
      error.value = e?.data?.statusMessage || e?.statusMessage || 'Algo salió mal. Intenta otra vez.'
    }
    finally {
      busy.value = false
    }
  }
  return { call, error, busy }
}
