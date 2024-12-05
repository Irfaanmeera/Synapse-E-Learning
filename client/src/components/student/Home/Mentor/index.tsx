import React, { Component } from "react";
import Slider from "react-slick";

// CAROUSEL DATA
interface DataType {
    profession: string;
    name: string;
    imgSrc: string;
}

const postData: DataType[] = [
    {
        profession: 'Senior UX Designer',
        name: 'Shoo Thar Mien',
        imgSrc: '/assets/mentor/user3.png',
    },
    {
        profession: 'Senior UX Designer',
        name: 'Shoo Thar Mien',
        imgSrc: '/assets/mentor/user2.png',
    },
    {
        profession: 'Senior UX Designer',
        name: 'Shoo Thar Mien',
        imgSrc: '/assets/mentor/user1.png',
    },
    {
        profession: 'Senior UX Designer',
        name: 'Shoo Thar Mien',
        imgSrc: '/assets/mentor/user3.png',
    },
    {
        profession: 'Senior UX Designer',
        name: 'Shoo Thar Mien',
        imgSrc: '/assets/mentor/user2.png',
    },
    {
        profession: 'Senior UX Designer',
        name: 'Shoo Thar Mien',
        imgSrc: '/assets/mentor/user1.png',
    },
];

// CAROUSEL SETTINGS

function SampleNextArrow(props: { className: string; style: React.CSSProperties; onClick: () => void; }) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "flex", justifyContent: "center", position: 'absolute', alignItems: "center", background: "#D5EFFA", padding: "28px", borderRadius: "30px", border: "1px solid #1A21BC" }}
            onClick={onClick}
        />
    );
}

function SamplePrevArrow(props: { className: string; style: React.CSSProperties; onClick: () => void; }) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "flex", justifyContent: "center", alignItems: "center", background: "#D5EFFA", padding: "28px", borderRadius: "30px", border: "1px solid #1A21BC" }}
            onClick={onClick}
        />
    );
}

export default class MultipleItems extends Component {
    render() {
        const settings = {
            dots: false,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            arrows: false,
            autoplay: false,
            speed: 4000,
            nextArrow: <SampleNextArrow className="" style={{}} onClick={() => {}} />,
            prevArrow: <SamplePrevArrow className="" style={{}} onClick={() => {}} />,
            autoplaySpeed: 4500,
            cssEase: "linear",
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false
                    }
                },
                {
                    breakpoint: 1000,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false
                    }
                },
                {
                    breakpoint: 530,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false
                    }
                }
            ]
        };

        return (
            <div className="py-10 sm:py-24 bg-paleblue" id="mentor">
                <div className='mx-auto max-w-2xl lg:max-w-7xl sm:py-4 px-4 lg:px-8 relative'>
                    <h2 className="lh-82 text-midnightblue text-4xl md:text-55xl text-center md:text-start font-semibold">Meet with our <br /> mentor.</h2>
                    <Slider {...settings}>
                        {postData.map((item, i) => (
                            <div key={i}>
                                <div className='m-3 py-14 md:my-10 text-center'>
                                    <div className="relative">
                                        <img src={item.imgSrc} alt="user-image" width={306} height={306} className="inline-block m-auto" />
                                        <div className="absolute right-[84px] bottom-[102px] bg-white rounded-full p-4">
                                            <img src={'/assets/mentor/linkedin.svg'} alt="linkedin-image" width={25} height={24} />
                                        </div>
                                    </div>
                                    <div className="-mt-10">
                                        <h3 className='text-2xl font-semibold text-lightblack'>{item.name}</h3>
                                        <h4 className='text-lg font-normal text-lightblack pt-2 opacity-50'>{item.profession}</h4>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        );
    }
}
