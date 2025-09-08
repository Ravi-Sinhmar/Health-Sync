const ShippingPage = () => {
  const Section = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {children}
    </div>
  );

  return (
    <main className="flex-grow bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipping Information</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="space-y-6">
            <Section title="Digital Service Delivery">
              <p className="text-gray-600">
                At Health Sync, we provide a digital subscription service that gives you immediate access to our platform's 
                premium features. Since we offer a software-based service rather than physical products, no shipping is required.
              </p>
            </Section>
            
            <Section title="Instant Access">
              <p className="text-gray-600">
                Upon successful subscription payment, your account is immediately upgraded with access to all Health Sync features. 
                You can begin using these features right away through our website or mobile application.
              </p>
            </Section>
            
            <Section title="No Physical Products">
              <p className="text-gray-600">
                Health Sync is a digital wellness platform that does not sell or ship physical goods. All our services are 
                delivered electronically through our secure online platform.
              </p>
            </Section>
            
            <Section title="Access Requirements">
              <p className="text-gray-600">
                To use Health Sync, you'll need:
              </p>
              <ul className="text-gray-600 list-disc list-inside mt-2 ml-4">
                <li>A compatible device (computer, smartphone, or tablet)</li>
                <li>An active internet connection</li>
                <li>Your Health Sync account credentials</li>
                <li>A supported web browser or our mobile application</li>
              </ul>
            </Section>
            
            <Section title="Global Availability">
              <p className="text-gray-600">
                Since Health Sync is a digital service, it's available immediately to users worldwide without any shipping 
                restrictions or delays. Our platform can be accessed from anywhere with an internet connection.
              </p>
            </Section>
            
            <Section title="Technical Support">
              <p className="text-gray-600">
                If you experience any issues accessing your subscription features, our support team is available to help. 
                Contact us at support@healthsync.example.com for assistance with account access or technical problems.
              </p>
            </Section>
            
            <Section title="Contact Us">
              <p className="text-gray-600">
                For any questions about our digital service delivery, please contact our customer support team at 
                ravi.sinhmar28@gmail.com. We're here to help you make the most of your Health Sync experience.
              </p>
            </Section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ShippingPage;