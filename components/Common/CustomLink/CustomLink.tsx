import React from 'react'
import Link from 'next/link'

interface CustomLinkProps {
    link: string
    content: string | JSX.Element
}

const CustomLink = (props: CustomLinkProps) => {
    return (
        <Link href={props.link} className="customLink">
            {props.content}
        </Link>
    )
}

export default CustomLink
