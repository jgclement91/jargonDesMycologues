import { PortableText } from "@portabletext/react";
import {PortableTextComponents} from '@portabletext/react'
import Link from "next/link";

const myPortableTextComponents: PortableTextComponents  = {
    marks: {
        link: ({value, children}: any) => {
          const linkClasses = "text-emerald-600 hover:text-emerald-700 no-underline hover:underline";

          if (value.href.startsWith('http')) {
            return (
              <a href={value.href} target="_blank " rel="noopener noreferrer" className={linkClasses}>
                {children}
              </a>
            )
          }

          const href = value.href.startsWith('/planche') ? value.href : `/glossaire/${value.href}`

          return (
            <Link href={href} target={value.href.startsWith('/planche') ? "_blank" : undefined} className={linkClasses}>
              {children}
            </Link>
          )
        }
    }
  };

const PortableTextComponent = (props: any) => {
    return <PortableText value={props.value} components={myPortableTextComponents} />
  }

export default PortableTextComponent;