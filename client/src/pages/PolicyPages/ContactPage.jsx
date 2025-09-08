// ContactPage.jsx
import { Mail, Phone, MapPin, Clock } from "react-feather";


const ContactPage = () => {
  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6 text-violet-600" />,
      title: 'Email',
      value: 'ravi.sihmar28@gmail.com',
      action: () => window.location.href = 'mailto:ravi.sinhmar28@gmail.com',
    },
    {
      icon: <Phone className="h-6 w-6 text-violet-600" />,
      title: 'Phone',
      value: '+91 8295236618',
      action: () => window.location.href = 'tel:+918295236618',
    },
    {
      icon: <MapPin className="h-6 w-6 text-violet-600" />,
      title: 'Address',
      value: 'Meham, Rohtak, Haryana (124112)',
    },
    {
      icon: <Clock className="h-6 w-6 text-violet-600" />,
      title: 'Response Time',
      value: 'Within 24-48 hours',
    },
  ];

  return (
 
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
            <p className="text-gray-600">We're here to help with any questions about Health Sync</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Get in Touch</h2>
            <p className="text-gray-600 mb-6 text-center text-base">
              Have questions about your health tracking, account, or our services? Our support team is here to help you.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactMethods.map((item, index) => (
                <div 
                  key={index} 
                  className={`flex items-center p-4 bg-gray-50 rounded-lg ${item.action ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                  onClick={item.action}
                >
                  {item.icon}
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 mt-1 text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-gray-500 text-sm mt-6 text-center">
              For technical issues, please include your account email and device information for faster resolution.
            </p>
          </div>
        </div>
      </main>
  
  );
};

export default ContactPage;