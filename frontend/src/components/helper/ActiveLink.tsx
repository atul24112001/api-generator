import { useRouter } from "next/router";
import Link, { LinkProps } from "next/link";
import React, { PropsWithChildren, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

type ActiveLinkProps = LinkProps & {
  className?: string;
  activeClassName: string;
};

const ActiveLink = ({
  children,
  activeClassName,
  className,
  ...props
}: PropsWithChildren<ActiveLinkProps>) => {
  const [computedClassName, setComputedClassName] = useState(className);
  const pathName = usePathname();
  useEffect(() => {
    if (pathName == props.href) {
      setComputedClassName(`${className} ${activeClassName}`.trim());
    } else {
      setComputedClassName(className);
    }
    console.log({
      pathName: pathName,
      "props.href": props.href,
    });
    // Check if the router fields are updated client-side
    // if (isReady) {
    //   // Dynamic route will be matched via props.as
    //   // Static route will be matched via props.href
    //   const linkPathname = new URL(
    //     (props.as || props.href) as string,
    //     location.href
    //   ).pathname;

    //   // Using URL().pathname to get rid of query and hash
    //   const activePathname = new URL(asPath, location.href).pathname;

    //   const newClassName =
    //     linkPathname === activePathname
    //       ? `${className} ${activeClassName}`.trim()
    //       : className;

    //   if (newClassName !== computedClassName) {
    //     setComputedClassName(newClassName);
    //   }
    // }
  }, [pathName, props.href, activeClassName, className]);

  return (
    <Link className={computedClassName} {...props}>
      {children}
    </Link>
  );
};

export default ActiveLink;
