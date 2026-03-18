import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata = {
  title: 'Privacy Policy - PodStream',
  description: 'Privacy policy for PodStream podcast platform',
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto max-w-3xl px-4 py-16">
          <div className="space-y-8">
            <div>
              <h1 className="mb-4 text-4xl font-bold">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: March 2026</p>
            </div>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. Introduction</h2>
              <p className="text-muted-foreground">
                PodStream ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
              <p className="text-muted-foreground">We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
              <ul className="list-inside space-y-2 text-muted-foreground">
                <li>• <strong>Personal Data:</strong> Name, email address, phone number, and other contact information</li>
                <li>• <strong>Podcast Data:</strong> Information you provide about podcasts you create, including title, description, and artwork</li>
                <li>• <strong>Usage Data:</strong> Information about how you interact with our service, including listening history and preferences</li>
                <li>• <strong>Device Information:</strong> Device type, operating system, and browser information</li>
                <li>• <strong>Analytics Data:</strong> Information collected through cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. Use of Your Information</h2>
              <p className="text-muted-foreground">Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
              <ul className="list-inside space-y-2 text-muted-foreground">
                <li>• Create and manage your account</li>
                <li>• Process your transactions and send related information</li>
                <li>• Email you regarding your account or order</li>
                <li>• Fulfill and manage purchases, orders, payments, and other transactions related to the Site</li>
                <li>• Generate a personal profile about you so that future visits to the Site will be personalized</li>
                <li>• Increase the efficiency and operation of the Site</li>
                <li>• Monitor and analyze usage and trends to improve your experience with the Site</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. Disclosure of Your Information</h2>
              <p className="text-muted-foreground">
                We may share or disclose your information in the following situations:
              </p>
              <ul className="list-inside space-y-2 text-muted-foreground">
                <li>• <strong>By Law or to Protect Rights:</strong> If we believe the release of information is necessary to comply with the law</li>
                <li>• <strong>Third-Party Service Providers:</strong> To vendors, consultants, and other service providers who need access to such information to carry out work on our behalf</li>
                <li>• <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Security of Your Information</h2>
              <p className="text-muted-foreground">
                We use administrative, technical, and physical security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Contact Us Regarding Privacy</h2>
              <p className="text-muted-foreground">
                If you have questions or comments about this Privacy Policy, please contact us at:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>Email: privacy@podstream.com</p>
                <p>Support: support@podstream.com</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Policy Changes</h2>
              <p className="text-muted-foreground">
                We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on the Site and updating the "Last updated" date.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">8. Your Privacy Rights</h2>
              <p className="text-muted-foreground">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-inside space-y-2 text-muted-foreground">
                <li>• Right to access your personal data</li>
                <li>• Right to correct inaccurate data</li>
                <li>• Right to request deletion of your data</li>
                <li>• Right to restrict processing of your data</li>
                <li>• Right to data portability</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">9. Cookies</h2>
              <p className="text-muted-foreground">
                Our Site may use "cookies" to enhance your experience. We respect your right to privacy, and you can choose not to allow certain types of cookies. Most web browsers allow you to control cookies through their settings.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
