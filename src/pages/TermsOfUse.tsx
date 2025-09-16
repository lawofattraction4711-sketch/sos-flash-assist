import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Terms of Use</CardTitle>
            <CardDescription className="text-center text-lg">
              Festival SOS Light Application
            </CardDescription>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Effective Date: December 16, 2024
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By downloading, installing, or using the Festival SOS Light application ("the App"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the App.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
              <p className="text-muted-foreground">
                Festival SOS Light is a mobile application designed to provide emergency signaling capabilities using your device's flashlight and screen. The App is intended for emergency situations and festival safety purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
              <div className="text-muted-foreground space-y-2">
                <p>By using the App, you agree to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Use the App only for legitimate emergency or safety purposes</li>
                  <li>Not use the App in a way that could cause harm to yourself or others</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Not attempt to reverse engineer or modify the App</li>
                  <li>Be mindful of battery usage when using emergency features</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Emergency Services Disclaimer</h2>
              <p className="text-muted-foreground">
                <strong>IMPORTANT:</strong> This App is NOT a replacement for professional emergency services. In case of a real emergency, always contact local emergency services (911, 112, or your local emergency number) immediately. The App is designed as a supplementary tool only.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Limitations of Liability</h2>
              <p className="text-muted-foreground">
                The App is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use or inability to use the App, including but not limited to device battery drain, hardware issues, or failure to receive emergency assistance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Device Compatibility</h2>
              <p className="text-muted-foreground">
                The App requires access to your device's flashlight and screen brightness controls. We are not responsible for compatibility issues with specific devices or operating system versions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content, features, and functionality of the App are owned by us and are protected by copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Termination</h2>
              <p className="text-muted-foreground">
                We reserve the right to terminate or suspend access to the App at any time without notice. You may stop using the App at any time by uninstalling it from your device.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Updates and Changes</h2>
              <p className="text-muted-foreground">
                We may update the App and these Terms of Use from time to time. Continued use of the App after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Governing Law</h2>
              <p className="text-muted-foreground">
                These terms are governed by and construed in accordance with applicable laws. Any disputes will be resolved in the appropriate courts.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Contact Information</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Use, please contact us at:
              </p>
              <div className="bg-muted p-4 rounded-lg mt-2">
                <p className="font-medium">Email: support@festivalsos.com</p>
                <p>Subject: Terms of Use Inquiry</p>
              </div>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-muted-foreground text-center">
                By using Festival SOS Light, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfUse;