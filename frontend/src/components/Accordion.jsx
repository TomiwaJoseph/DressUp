import { useState } from "react";
import { accordionData } from "../accordionData";
import card from "../images/cards.png";
import "./accordion.css";

const Accordion = () => {
  const [clicked, setClicked] = useState(null);
  const toggle = (index) => {
    if (clicked === index) {
      // if clicked question is already open, then close it
      return setClicked(null);
    }
    // else open it
    setClicked(index);
  };

  return (
    <div className="accordion-area">
      {accordionData.map((item, index) => (
        <div className="panel" key={item.header}>
          <div onClick={() => toggle(index)} className="panel-header">
            <h1>{item.header}</h1>
            <span>
              {clicked === index ? (
                <i className="fas fa-angle-up"></i>
              ) : (
                <i className="fas fa-angle-down"></i>
              )}
            </span>
          </div>
          {clicked === index ? (
            <div className="panel-body">
              {index === 0 && (
                <>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Proin pharetra tempor so dales. Phasellus sagittis auctor
                    gravida. Integer bibendum sodales arcu id te mpus. Ut
                    consectetur lacus leo, non scelerisque nulla euismod nec.
                  </p>
                  <p>Approx length 66cm/26" (Based on a UK size 8 sample)</p>
                  <p>Mixed fibres</p>
                  <p>
                    The Model wears a UK size 8/ EU size 36/ US size 4 and her
                    height is 5'8"
                  </p>
                </>
              )}
              {index === 1 && (
                <>
                  <img src={card} alt="" />
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Proin pharetra tempor so dales. Phasellus sagittis auctor
                    gravida. Integer bibendum sodales arcu id te mpus. Ut
                    consectetur lacus leo, non scelerisque nulla euismod nec.
                  </p>
                </>
              )}
              {index === 2 && (
                <>
                  <h4>7 Days Returns</h4>
                  <p>
                    Cash on Delivery Available
                    <br />
                    Home Delivery <span>3 - 4 days</span>
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Proin pharetra tempor so dales. Phasellus sagittis auctor
                    gravida. Integer bibendum sodales arcu id te mpus. Ut
                    consectetur lacus leo, non scelerisque nulla euismod nec.
                  </p>
                </>
              )}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default Accordion;
