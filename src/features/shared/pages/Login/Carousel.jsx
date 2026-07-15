import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";

const LoginCarouselSlide = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  return (
    <Carousel
      controls={false}
      indicators={true}
      activeIndex={index}
      onSelect={handleSelect}
      interval={3000}
    >
      <Carousel.Item>
        <h3 className="fw-bold text-center">Oasis Notes</h3>
        <p>
          Oasis Notes gives you the ability to access medical records from
          anywhere. Oasis Notes is designed to assist Behavioral Health
          Residential Facilities with compliance. Oasis Notes helps you go
          paperless with our customized forms and unlimited storage space. Oasis
          Notes also gives you the ability to immediately print out medical
          records in a timely manner.
        </p>
      </Carousel.Item>
      <Carousel.Item>
        <h3 className="fw-bold text-center">Client Records</h3>
        <p>
          We have customizable intake documents, initial assessment, treatment
          plan, medication administration records(MARs), shift progress notes,
          therapy progress notes, incident reports, contact notes and so on. We
          continue to update and add more documentation so as to make medical
          record keeping easier for our subscribers. <br />
          <br />
          We have a tracker to help you track clients' staffing/ART meetings,
          concurrent reviews, appointments, and more.
        </p>
      </Carousel.Item>
      <Carousel.Item>
        <h3 className="fw-bold text-center">Employees</h3>
        <p>
          We have customizable employment forms for employees to include, but
          not limited to, employment application, reference check, facility
          orientation, skills and knowledge verification, and job description.
          Oasis Notes also has a tracker to help you track employees' annual
          trainings and certifications.
        </p>
      </Carousel.Item>
      <Carousel.Item>
        <h3 className="fw-bold text-center">Practice Management</h3>
        <p>
          We have customizable forms for your quality management program,
          evacuation drill, disaster drill, clinical oversight, employee
          schedule, time sheets and more.
        </p>
      </Carousel.Item>
    </Carousel>
  );
};

export default LoginCarouselSlide;
