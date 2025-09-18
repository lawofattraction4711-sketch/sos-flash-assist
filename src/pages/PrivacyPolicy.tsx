import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
            <p className="text-center text-muted-foreground">
              Effective Date: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p className="text-muted-foreground mb-4">
                Festival SOS Light is designed with privacy in mind. We collect minimal information necessary to provide our safety services:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Location Data:</strong> Only when you activate the SOS feature to help emergency responders find you</li>
                <li><strong>Device Information:</strong> Basic device info for app functionality and crash reporting</li>
                <li><strong>Emergency Contacts:</strong> Stored locally on your device only</li>
                <li><strong>Usage Analytics:</strong> Anonymous data to improve app performance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">
                Your information is used solely to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide emergency assistance when you activate SOS</li>
                <li>Connect you with your emergency contacts</li>
                <li>Improve app functionality and user experience</li>
                <li>Comply with legal requirements for emergency services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Data Storage and Security</h2>
              <p className="text-muted-foreground">
                We implement industry-standard security measures to protect your data. Emergency contact information is stored locally on your device. Location data is only transmitted during active SOS situations and is not stored permanently.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Data Sharing</h2>
              <p className="text-muted-foreground mb-4">
                We do not sell or share your personal information except:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>During emergency situations with authorized emergency responders</li>
                <li>With your designated emergency contacts when you activate SOS</li>
                <li>When required by law or legal process</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Access and review your personal information</li>
                <li>Request deletion of your data</li>
                <li>Opt out of non-essential data collection</li>
                <li>Update your emergency contact information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our app is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you are a parent and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this privacy policy, please contact us:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-muted-foreground">
                  <strong>Email:</strong> support@festivalsos.nl<br />
                  <strong>Website:</strong> https://festivalsos.com/contact
                </p>
              </div>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-muted-foreground text-center">
                This privacy policy was last updated on {new Date().toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;