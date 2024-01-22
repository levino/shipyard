import { describe, test, expect } from 'vitest'
import { toSidebarEntries } from '../../apps/levinkeller.de/src/tools./../../../shipyard/docs./../../../shipyard/docs/sidebarEntries'
describe('Sidebar subEntry helpers', () => {
  test.each([
    [
      [
        {
          title: 'foo',
          path: '/foo',
        },
      ],
      {
        foo: {
          label: 'foo',
          href: '/foo',
        },
      },
    ],
    [
      [
        {
          title: 'foo',
          path: '/foo',
        },
        {
          title: 'bar',
          path: '/bar',
        },
      ],
      {
        foo: {
          label: 'foo',
          href: '/foo',
        },
        bar: {
          label: 'bar',
          href: '/bar',
        },
      },
    ],
    [
      [
        {
          title: 'foo baz',
          path: '/baz/foo',
        },
        {
          title: 'bar baz',
          path: '/baz/bar',
        },
      ],
      {
        baz: {
          subEntry: {
            foo: {
              label: 'foo baz',
              href: '/baz/foo',
            },
            bar: {
              label: 'bar baz',
              href: '/baz/bar',
            },
          },
        },
      },
    ],
    [
      [
        {
          title: 'foo',
          path: '/foo',
        },
        {
          title: 'bar',
          path: '/bar',
        },
        {
          title: 'foo baz',
          path: '/baz/foo',
        },
        {
          title: 'bar baz',
          path: '/baz/bar',
        },
      ],
      {
        foo: {
          label: 'foo',
          href: '/foo',
        },
        bar: {
          label: 'bar',
          href: '/bar',
        },
        baz: {
          subEntry: {
            foo: {
              label: 'foo baz',
              href: '/baz/foo',
            },
            bar: {
              label: 'bar baz',
              href: '/baz/bar',
            },
          },
        },
      },
    ],
    [
      [
        {
          title: 'foo',
          path: '/foo',
        },
        {
          title: 'bar',
          path: '/bar',
        },
        { title: 'baz', path: '/baz' },
        {
          title: 'foo baz',
          path: '/baz/foo',
        },
        {
          title: 'bar baz',
          path: '/baz/bar',
        },
      ],
      {
        foo: {
          label: 'foo',
          href: '/foo',
        },
        bar: {
          label: 'bar',
          href: '/bar',
        },
        baz: {
          label: 'baz',
          href: '/baz',
          subEntry: {
            foo: {
              label: 'foo baz',
              href: '/baz/foo',
            },
            bar: {
              label: 'bar baz',
              href: '/baz/bar',
            },
          },
        },
      },
    ],
    [
      [
        {
          title: 'foo',
          path: '/foo',
        },
        {
          title: 'bar',
          path: '/bar',
        },
        { title: 'baz', path: '/baz', link: false },
        {
          title: 'foo baz',
          path: '/baz/foo',
        },
        {
          title: 'bar baz',
          path: '/baz/bar',
        },
      ],
      {
        foo: {
          label: 'foo',
          href: '/foo',
        },
        bar: {
          label: 'bar',
          href: '/bar',
        },
        baz: {
          label: 'baz',
          subEntry: {
            foo: {
              label: 'foo baz',
              href: '/baz/foo',
            },
            bar: {
              label: 'bar baz',
              href: '/baz/bar',
            },
          },
        },
      },
    ],
  ])(
    'transforms a list of doc sites into a list of sidebar subEntry',
    (input, expected) => {
      expect(toSidebarEntries(input)).toEqual(expected)
    },
  )
})
