'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BrandLogo } from '@/components/brand-logo'
import { ArrowLeft, Loader2 } from 'lucide-react'

import { useAuth } from '@/context/auth-context'
import { useRouter } from 'next/navigation'

import styles from './login-page.module.scss'

export function LoginPage() {
  const { login, error, loading } = useAuth()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const elements = e.currentTarget.elements as any
    const email = elements.user.value
    const password = elements.pass.value

    try {
      await login(email, password)
    } catch (err) {
      // El error se maneja en el contexto de Auth
    }
  }

  return (
    <main className={styles.loginPage}>
      <div className={styles.backButtonContainer}>
        <button
          onClick={() => router.push('/')}
          className={styles.backButton}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al sitio
        </button>
      </div>

      <div className={styles.loginContent}>
        <div className={styles.loginWrapper}>
          <div className={styles.header}>
            <BrandLogo showText={false} className="scale-125" />
            <h1 className={styles.title}>
              Bienvenido de nuevo
            </h1>
            <p className={styles.subtitle}>
              Ingresa a tu panel de Berçário
            </p>
          </div>

          <div className={styles.card}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formField}>
                <Label htmlFor="user">Usuario</Label>
                <Input
                  id="user"
                  type="email"
                  defaultValue="mayorista@demo.co"
                  placeholder="tu usuario"
                  required
                />
              </div>
              <div className={styles.formField}>
                <div className={styles.fieldHeader}>
                  <Label htmlFor="pass">Contraseña</Label>
                  <span className={styles.forgotText}>¿Olvidaste?</span>
                </div>
                <Input
                  id="pass"
                  type="password"
                  defaultValue="demo1234"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className={styles.errorAlert}>
                  {error}
                </div>
              )}

              <Button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    Ingresando...
                  </>
                ) : (
                  'Iniciar sesión'
                )}
              </Button>
            </form>
          </div>

          <p className={styles.demoText}>
            Demo: usa las credenciales precargadas y presiona iniciar sesión.
          </p>
        </div>
      </div>
    </main>
  )
}
