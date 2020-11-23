import styles from "./styles.scss";
import OutroImg from "../../assets/images/farm-switch-outro/outro.svg";
import Button from "../Form/Button";
import React from "react";

export default function FarmSwitchPureOutroSplash({onContinue}) {

  // TODO: Get farm name from store 
  const newFarm = "Garden of Eden";
  const descriptionTop = "The barn door is secure.";
  const descriptionBottom = "Heading to ";

  
  return (
    <div className={styles.outroContainer}>
      <div className={styles.title}>
        {`Switching Farms`}
      </div>
      <div className={styles.imgContainer}>
        <img src={OutroImg}/>
      </div>

      <div className={styles.descriptionTop}>
          {descriptionTop}
      </div>
      <div className={styles.descriptionBottom}>
        {descriptionBottom}
        <div className={styles.bold}>
          {newFarm}
        </div>
      </div>
      <Button className={styles.bottomContainer} children="Let's Go!"></Button>

    </div>
  )
}
