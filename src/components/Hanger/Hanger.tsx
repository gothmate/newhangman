import Image from "next/image";
import styles from '@/app/page.module.sass'

export default function Hanger(props: any) {
    return (
        <div className={styles.hanger}>
          <Image 
            className={styles.hangman} 
            width={200}
            height={200}
            src={props.hanged}
            alt="hangman"
            priority
          />
          <div className={styles.info}>
            <div className={styles.poster}>
              {props.poster !== "?" ? <Image   
                width={100}
                height={100}
                src={props.poster}
                alt='poster'
                priority
              /> : props.poster}
            </div>
            <div>
              <p>{props.info[0]}</p>
              <p>{props.info[1]}</p>
              
            </div>
          </div>
        </div>
    )
}