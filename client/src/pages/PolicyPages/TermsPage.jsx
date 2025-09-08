// TermsPage.jsx


const TermsPage = () => {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="space-y-6">
              <Section title="Acceptance of Terms">
                <p className="text-gray-600">
                  By accessing or using Health Sync, you agree to be bound by these Terms of Service 
                  and our Privacy Policy. If you disagree with any part of these terms, you may not access our services.
                </p>
              </Section>
              
              <Section title="Eligibility">
                <p className="text-gray-600">
                  You must be at least 16 years old to use Health Sync. By using our services, you represent 
                  that you meet this age requirement and are capable of forming binding contracts.
                </p>
              </Section>
              
              <Section title="Account Registration">
                <p className="text-gray-600">
                  You agree to provide accurate information during registration and to keep your login credentials secure. 
                  You're responsible for all activities under your account. Please notify us immediately of any unauthorized use.
                </p>
              </Section>
              
              <Section title="Health Information">
                <p className="text-gray-600">
                  Health Sync provides tools to track and visualize health data, but we do not provide medical advice. 
                  Always consult healthcare professionals for medical concerns. The information provided by our platform 
                  should not be used for self-diagnosis or treatment decisions.
                </p>
              </Section>
              
              <Section title="Subscription Plans">
                <p className="text-gray-600">
                  Health Sync offers both free and premium subscription plans. Premium features are available through 
                  monthly or annual subscriptions that automatically renew until canceled. You can cancel your subscription 
                  at any time through your account settings.
                </p>
              </Section>
              
              <Section title="User Content">
                <p className="text-gray-600">
                  You retain ownership of all health data you upload to Health Sync. By using our services, you grant us 
                  a license to store, process, and display this data to provide you with health insights and recommendations.
                </p>
              </Section>
              
              <Section title="Prohibited Activities">
                <p className="text-gray-600">
                  You may not use our services for any unlawful purpose, attempt to circumvent security measures, 
                  or interfere with the proper functioning of the platform. You also agree not to misuse our AI health 
                  assistant or provide false health information.
                </p>
              </Section>
              
              <Section title="Intellectual Property">
                <p className="text-gray-600">
                  All Health Sync content, logos, and designs are our property or licensed to us and protected by copyright laws. 
                  You may not use them without express permission.
                </p>
              </Section>
              
              <Section title="Limitation of Liability">
                <p className="text-gray-600">
                  Health Sync is not liable for any indirect, incidental, or consequential damages arising from your use 
                  of our services. Our total liability is limited to the amount you paid for services in the past six months.
                </p>
              </Section>
              
              <Section title="Governing Law">
                <p className="text-gray-600">
                  These terms are governed by the laws of the United States. Any disputes will be subject to the exclusive 
                  jurisdiction of the courts in the state where Health Sync is registered.
                </p>
              </Section>
            </div>
          </div>
        </div>
      </main>
  
  );
};

export default TermsPage;