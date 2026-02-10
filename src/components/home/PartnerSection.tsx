import { partnerLogos, partnerLogoBasePath } from "../../animations/data"

const PartnerSection = () => {
    const logoPartner = [...partnerLogos, ...partnerLogos];

    return (
        <section id="partner_logos">
            <div className="container">
                {/* <!-- Heading --> */}
                <div className="mt-10">
                    <h2 className="sub_heading">Có mặt tại</h2>
                    <h1 className="main_heading">Những nhà phân phối
                        <span className="text-gradient"> uy tín</span>
                    </h1>
                </div>

                {/* <!-- Logo Partner --> */}
                <div className="flex mt-9 md:mt-16 [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
                    <div className="flex flex-none logos-wrapper gap-14 pl-14">
                        {logoPartner.map((logo, idx) => (
                            <img
                                key={`${logo.fileName}-${idx}`}
                                src={`${partnerLogoBasePath}${logo.fileName}`}
                                alt={logo.alt}
                                className="logo-ticker-image"
                                loading="lazy"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PartnerSection