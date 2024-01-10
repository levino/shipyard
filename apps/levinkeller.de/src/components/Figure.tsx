import React from 'react'
import Zoom from 'react-medium-image-zoom'
import classnames from 'classnames'
export const Figure: React.FC<React.PropsWithChildren<{ caption: string }>> = ({
  children,
  caption,
}) => (
  <figure>
    {children}
    <FigureCaption>{caption}</FigureCaption>
  </figure>
)

export const FigureCaption: React.FC<
  React.PropsWithChildren<Record<string, unknown>>
> = ({ children }) => (
  <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
    {children}
  </figcaption>
)

export const ZoomableResponsiveImage: React.FC<{
  srcSet: string
  src: string
  width: number
  height: number
  alt: string
  loading: 'lazy' | 'eager'
  className?: string
}> = ({ srcSet, src, width, height, loading = 'lazy', alt, className }) => (
  <Zoom>
    <img
      alt={alt}
      loading={loading}
      className={classnames('h-auto max-w-full', className)}
      srcSet={srcSet}
      src={src}
      width={width}
      height={height}
    />
  </Zoom>
)
