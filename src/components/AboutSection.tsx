import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Award, Heart, Handshake } from 'lucide-react';
import { useSupabaseMEL } from '@/contexts/SupabaseMELContext';

const AboutSection = () => {
  const { president, secretary } = useSupabaseMEL();

  const stats = [
    {
      icon: Users,
      title: 'सदस्य संख्या',
      value: '500+',
      description: 'सक्रिय सदस्य'
    },
    {
      icon: Award,
      title: 'प्रकल्प',
      value: '25+',
      description: 'पूर्ण झालेले प्रकल्प'
    },
    {
      icon: Heart,
      title: 'सेवा वर्षे',
      value: '15+',
      description: 'समाजसेवेची वर्षे'
    },
    {
      icon: Handshake,
      title: 'भागीदारी',
      value: '50+',
      description: 'सामुदायिक भागीदारी'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-orange-50 to-white section-watermark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-marathi-orange mb-6">
            संस्था माहिती
          </h2>
          <div className="w-24 h-1 saffron-gradient mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            प्रणिता प्रतिष्ठान ही एक समाजसेवी संस्था आहे जी गेली अनेक वर्षे समाजातील विविध 
            समस्यांवर कार्य करत आहे. आमचे मुख्य उद्दिष्ट समाजातील गरजू व्यक्तींना मदत करणे आणि 
            त्यांच्या जीवनमानात सुधारणा घडवून आणणे हे आहे.
          </p>
        </div>

        {/* Leadership Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* President */}
          <Card className="cultural-shadow animate-fade-in hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-marathi-orange mb-4">अध्यक्ष</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {president?.photo_url && (
                <img 
                  src={president.photo_url} 
                  alt="President" 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
              )}
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {president?.name || 'श्री. राज पाटील'}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {president?.message ||
                  'समाजसेवेच्या क्षेत्रात अग्रणी असलेल्या प्रणिता प्रतिष्ठानच्या अध्यक्षपदी कार्यरत आहेत. त्यांच्या नेतृत्वाखाली संस्थेने अनेक महत्वाचे प्रकल्प राबवले आहेत.'}
              </p>
            </CardContent>
          </Card>

          {/* Secretary */}
          <Card className="cultural-shadow animate-fade-in hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-marathi-orange mb-4">सचिव</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {secretary?.photo_url && (
                <img 
                  src={secretary.photo_url} 
                  alt="Secretary" 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
              )}
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {secretary?.name || 'सौ. प्रिया शर्मा'}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {secretary?.message ||
                  'संस्थेच्या दैनंदिन कामकाजाची जबाबदारी सांभाळणाऱ्या सचिव म्हणून कार्यरत आहेत. त्यांच्या कुशल व्यवस्थापनामुळे संस्थेची कार्ये सुरळीतपणे चालतात.'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <Card className="cultural-shadow animate-fade-in hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-marathi-orange mb-4">आमचे ध्येय</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                समाजातील प्रत्येक व्यक्तीला त्याच्या मूलभूत गरजा पूर्ण करण्यासाठी आवश्यक ती मदत 
                पुरवणे आणि त्यांना आत्मनिर्भर बनविण्याच्या दिशेने कार्य करणे. शिक्षण, आरोग्य, 
                आणि सामाजिक कल्याण या क्षेत्रात सेवा देणे.
              </p>
            </CardContent>
          </Card>

          <Card className="cultural-shadow animate-fade-in hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-marathi-orange mb-4">आमची दृष्टी</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                एक न्यायसंगत आणि समान समाज निर्माण करणे जिथे प्रत्येक व्यक्तीला विकासाची संधी 
                मिळेल. गरिबी निर्मूलन, शिक्षणाचा प्रसार, आणि आरोग्य सेवांची उपलब्धता या 
                दिशेने काम करणे आणि एक आदर्श समाज तयार करणे.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center cultural-shadow animate-fade-in hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-marathi-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-marathi-orange mb-2">{stat.value}</h3>
                <p className="text-sm font-medium text-gray-800 mb-1">{stat.title}</p>
                <p className="text-xs text-gray-600">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Our Work Areas */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-marathi-orange mb-8">आमची कार्यक्षेत्रे</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="cultural-shadow animate-fade-in hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📚</span>
                </div>
                <h4 className="text-xl font-bold text-marathi-orange mb-3">शिक्षण</h4>
                <p className="text-gray-700">
                  गरजू मुलांना शिक्षणाची संधी उपलब्ध करून देणे आणि शैक्षणिक सहाय्य पुरवणे.
                </p>
              </CardContent>
            </Card>

            <Card className="cultural-shadow animate-fade-in hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏥</span>
                </div>
                <h4 className="text-xl font-bold text-marathi-orange mb-3">आरोग्य</h4>
                <p className="text-gray-700">
                  आरोग्य सेवा, वैद्यकीय तपासणी आणि औषध वितरण कार्यक्रम राबवणे.
                </p>
              </CardContent>
            </Card>

            <Card className="cultural-shadow animate-fade-in hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🤝</span>
                </div>
                <h4 className="text-xl font-bold text-marathi-orange mb-3">सामाजिक कल्याण</h4>
                <p className="text-gray-700">
                  महिला सक्षमीकरण, वृद्ध सेवा आणि समुदायिक विकास कार्यक्रम.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
