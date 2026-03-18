import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata = {
  title: 'Terms of Service - PodStream',
  description: 'Terms of service for PodStream podcast platform',
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto max-w-3xl px-4 py-16">
          <div className="space-y-8">
            <div>
              <h1 className="mb-4 text-4xl font-bold">Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: March 2026</p>
            </div>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using PodStream ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Use License</h2>
              <p className="text-muted-foreground">
                Permission is granted to temporarily download one copy of the materials (information or software) on PodStream for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-inside space-y-2 text-muted-foreground">
                <li>• Modifying or copying the materials</li>
                <li>• Using the materials for any commercial purpose or for any public display</li>
                <li>• Attempting to decompile or reverse engineer any software contained on PodStream</li>
                <li>• Removing any copyright or other proprietary notations from the materials</li>
                <li>• Transferring the materials to another person or "mirroring" the materials on any other server</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. Disclaimer</h2>
              <p className="text-muted-foreground">
                The materials on PodStream are provided on an 'as is' basis. PodStream makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. Limitations</h2>
              <p className="text-muted-foreground">
                In no event shall PodStream or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on PodStream, even if PodStream or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Accuracy of Materials</h2>
              <p className="text-muted-foreground">
                The materials appearing on PodStream could include technical, typographical, or photographic errors. PodStream does not warrant that any of the materials on our website are accurate, complete, or current. PodStream may make changes to the materials contained on our website at any time without notice.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Links</h2>
              <p className="text-muted-foreground">
                PodStream has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by PodStream of the site. Use of any such linked website is at the user's own risk.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Modifications</h2>
              <p className="text-muted-foreground">
                PodStream may revise these terms of service for our website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">8. Governing Law</h2>
              <p className="text-muted-foreground">
                These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which PodStream operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">9. Contact Information</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service, please contact us at support@podstream.com
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
