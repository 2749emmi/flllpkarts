import Link from 'next/link';

const footerLinks = {
  about: ['Contact Us', 'About Us', 'Careers', 'Flipkart Stories', 'Press', 'Corporate Information'],
  groupCompanies: ['Myntra', 'Cleartrip', 'Shopsy'],
  help: ['Payments', 'Shipping', 'Cancellation & Returns', 'FAQ'],
  policy: ['Return Policy', 'Terms Of Use', 'Security', 'Privacy', 'Sitemap', 'Grievance Redressal'],
};

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#172337', color: '#fff', fontSize: '12px' }}>
      <div style={{ maxWidth: '1248px', margin: '0 auto', padding: '32px 16px 24px' }}>
        {/* Top links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '24px',
          paddingBottom: '24px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div>
            <h3 style={{ color: '#878787', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 600, letterSpacing: '0.5px', fontSize: '12px' }}>About</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {footerLinks.about.map(link => (
                <li key={link} style={{ marginBottom: '6px' }}>
                  <Link href="#" style={{ color: '#fff', textDecoration: 'none', fontSize: '12px' }}>{link}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ color: '#878787', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 600, letterSpacing: '0.5px', fontSize: '12px' }}>Group Companies</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {footerLinks.groupCompanies.map(link => (
                <li key={link} style={{ marginBottom: '6px' }}>
                  <Link href="#" style={{ color: '#fff', textDecoration: 'none', fontSize: '12px' }}>{link}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ color: '#878787', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 600, letterSpacing: '0.5px', fontSize: '12px' }}>Help</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {footerLinks.help.map(link => (
                <li key={link} style={{ marginBottom: '6px' }}>
                  <Link href="#" style={{ color: '#fff', textDecoration: 'none', fontSize: '12px' }}>{link}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ color: '#878787', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 600, letterSpacing: '0.5px', fontSize: '12px' }}>Consumer Policy</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {footerLinks.policy.map(link => (
                <li key={link} style={{ marginBottom: '6px' }}>
                  <Link href="#" style={{ color: '#fff', textDecoration: 'none', fontSize: '12px' }}>{link}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ color: '#878787', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 600, letterSpacing: '0.5px', fontSize: '12px' }}>Mail Us</h3>
            <p style={{ color: '#fff', lineHeight: '1.8', fontSize: '12px' }}>
              Flipkart Internet Private Limited,<br />
              Buildings Alyssa, Begonia &amp;<br />
              Clove Embassy Tech Village,<br />
              Outer Ring Road, Devarabeesanahalli Village,<br />
              Bengaluru, 560103, Karnataka, India
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
          alignItems: 'center', paddingTop: '16px', gap: '12px',
        }}>
          <span style={{ color: '#878787', fontSize: '12px' }}>
            &copy; 2007-2025 Flipkart.com
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <Link href="#" style={{ color: '#878787', fontSize: '12px', textDecoration: 'none' }}>Sell On Flipkart</Link>
            <Link href="#" style={{ color: '#878787', fontSize: '12px', textDecoration: 'none' }}>Advertise</Link>
            <Link href="#" style={{ color: '#878787', fontSize: '12px', textDecoration: 'none' }}>Gift Cards</Link>
            <Link href="#" style={{ color: '#878787', fontSize: '12px', textDecoration: 'none' }}>Help Center</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
