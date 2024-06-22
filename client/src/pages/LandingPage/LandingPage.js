import './LandingPage.scss';
import dellLogoWht from '../../assets/images/logos/dell-spectra-logo-wh.svg';

function LandingPage() {

    return(
        <div className='landing-page'>
            <main>
                <section className='title'>
                    <div className='title__page-header'>Track MSRP Compliance Effortlessly</div>
                    <div className='title__subheader'>Empower your decision making with Spectra.<br/>Redefining MSRP Tracking.</div>
                </section>
                <section className='card'>
                    <div className='card-container'>
                        <div className='card__features'>
                            <div className='card__features--cm'>
                                <img src="" alt="" />
                                <p>Continuous<br/>Monitoring</p>
                            </div>
                            <div className='card__features--ad'>
                                <img src="" alt="" />
                                <p>Accurate<br/>Detection</p>
                            </div>
                            <div className='card__features--s'>
                                <img src="" alt="" />
                                <p>Scalability</p>
                            </div>
                        </div>
                        <div className='card__benefits'>
                            <div className='card__benefits--bi'>
                                <img src="" alt="" />
                                <p>Brand<br/>Integrity</p>
                            </div>
                            <div className='card__benefits--ms'>
                                <img src="" alt="" />
                                <p>Market<br/>Stability</p>
                            </div>
                            <div className='card__benefits--e'>
                                <img src="" alt="" />
                                <p>Efficiency</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='login'>
                    <button className='login__cta'>
                        <img className='login__icon' src="" alt="" />
                        <div className='login__btn-text'>Start Now</div>
                    </button>
                </section>
            </main>
            <div className="dell-molecules">
                <div className="overlap">
                    <div className="overlap-group">
                        <div className="div" />
                        <div className="div-2" />
                        <div className="div-3" />
                        <div className="div-4" />
                        <div className="div-5" />
                        <div className="div-6" />
                    </div>
                    <div className="div-7" />
                </div>
            </div>
            <div className='dell-logo'>
                <img src={dellLogoWht} alt="dell-logo-wht" />
            </div>
        </div>
    )
}

export default LandingPage;
