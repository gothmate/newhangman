import Image from "next/image";
import style from './page.module.sass'

export default function Hanger(props: any) {
    return (
        <div className={style.hanger}>
          <Image 
            className={style.hangman} 
            width={200}
            height={200}
            src={props.hanged}
            alt="hangman"
            priority
          />
          <div className={style.info}>
            <div className={style.poster}>
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