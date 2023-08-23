import { PortableText } from "@portabletext/react";
import {PortableTextComponents} from '@portabletext/react'

const myPortableTextComponents: PortableTextComponents  = {
    marks: {
        link: ({value, children}: any) => {
          return (
            <a href={value.href} target={value.href.startsWith('/planche') ? "_blank" : undefined}>
              {children}
            </a>
          )
        }
    }
  };

const PortableTextComponent = (props: any) => {
    return <PortableText value={props.value} components={myPortableTextComponents} />
  }

export default PortableTextComponent;