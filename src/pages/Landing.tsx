import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Smartphone, Zap, Users, Download, Apple } from 'lucide-react';
import { AppDemo } from '@/components/AppDemo';
import logoImage from '@/assets/festival-sos-logo.webp';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-3">
          <img src={logoImage} alt="Festival SOS Light Logo" className="w-12 h-12 rounded-lg" />
          <h1 className="text-3xl font-bold text-foreground">Festival SOS Light</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-foreground mb-6">
            Noodhulp in <span className="text-emergency">drukke ruimtes</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Festival SOS Light is een emergency alert systeem speciaal ontworpen voor festivals, 
            concerten en andere drukke evenementen. Met één druk op de knop activeer je een 
            opvallend rood-wit flashend signaal dat hulpverleners snel naar jouw locatie leidt.
          </p>
          
          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="flex items-center gap-2 px-8 py-4 text-lg">
              <Apple className="w-6 h-6" />
              Download voor iOS
            </Button>
            <Button size="lg" variant="secondary" className="flex items-center gap-2 px-8 py-4 text-lg">
              <Download className="w-6 h-6" />
              Download voor Android
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="flex items-center gap-2 px-8 py-4 text-lg"
              onClick={() => window.location.href = '/app'}
            >
              <Zap className="w-6 h-6" />
              Probeer de Web App
            </Button>
          </div>

          {/* Interactive App Demo */}
          <AppDemo />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">
            Waarom Festival SOS Light?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Zap className="w-12 h-12 text-emergency mx-auto mb-4" />
                <CardTitle>Instant Zichtbaarheid</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Het felle rood-wit flashende signaal is zelfs in drukke menigtes van veraf zichtbaar. 
                  Hulpverleners vinden je binnen seconden.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-accent mx-auto mb-4" />
                <CardTitle>Geen Internetverbinding Nodig</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  De app werkt volledig offline. Zelfs als het netwerk overbelast is tijdens 
                  grote evenementen, blijft je noodsignaal actief.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <AlertTriangle className="w-12 h-12 text-emergency mx-auto mb-4" />
                <CardTitle>Eenvoudig in Gebruik</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Één grote knop - dat is alles. In een noodsituatie hoef je niet na te denken. 
                  Druk en je bent zichtbaar voor hulpverleners.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-foreground mb-12">Hoe het werkt</h3>
          
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">1. Download de app</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Installeer Festival SOS Light gratis op je smartphone voordat je naar een evenement gaat.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">2. Activeer bij nood</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Druk op de grote SOS-knop. Je scherm begint onmiddellijk rood en wit te flitsen.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">3. Hulp arriveert</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Hulpverleners zien je signaal van veraf en kunnen je snel bereiken in de menigte.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 border-emergency/30 bg-emergency/5">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-emergency">Belangrijke Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground text-lg leading-relaxed">
                Deze app maakt geen directe verbinding met officiële hulpdiensten. 
                Het flashende signaal helpt festivalpersoneel en beveiliging om je sneller te vinden. 
                Voor echte noodsituaties bel altijd <strong className="text-foreground">112</strong>.
                <br /><br />
                Elke seconde telt - daarom helpt deze app hulpverleners je sneller te lokaliseren.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold text-foreground mb-6">
            Zorg dat je voorbereid bent
          </h3>
          <p className="text-xl text-muted-foreground mb-8">
            Download Festival SOS Light nu en ga met een gerust hart naar je volgende evenement.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="flex items-center gap-2 px-8 py-4 text-lg">
              <Apple className="w-6 h-6" />
              Download voor iOS
            </Button>
            <Button size="lg" variant="secondary" className="flex items-center gap-2 px-8 py-4 text-lg">
              <Download className="w-6 h-6" />
              Download voor Android
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="flex items-center gap-2 px-8 py-4 text-lg"
              onClick={() => window.location.href = '/app'}
            >
              <Zap className="w-6 h-6" />
              Probeer de Web App
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">
              © 2024 Festival SOS Light. Ontwikkeld voor veiligheid op evenementen.
            </p>
            <div className="flex flex-wrap gap-4 mt-2 md:mt-0 justify-center md:justify-end">
              <Button 
                variant="link" 
                className="text-muted-foreground hover:text-foreground text-sm"
                onClick={() => window.location.href = '/privacy-policy'}
              >
                Privacy Policy
              </Button>
              <Button 
                variant="link" 
                className="text-muted-foreground hover:text-foreground text-sm"
                onClick={() => window.location.href = '/terms-of-use'}
              >
                Terms of Use
              </Button>
              <Button 
                variant="link" 
                className="text-muted-foreground hover:text-foreground"
                onClick={() => window.location.href = '/auth'}
              >
                Sign In
              </Button>
              <Button 
                variant="link" 
                className="text-muted-foreground hover:text-foreground"
                onClick={() => window.location.href = '/contact'}
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;