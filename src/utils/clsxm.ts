import type { ClassValue } from 'clsx';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const preppendBangToWords = (str: string) => {
  const words = str.split(' ');
  // remove emtyp words
  const filteredWords = words.filter((word) => word !== '');
  const newWords = filteredWords.map((word) => `!${word}`);
  return newWords.join(' ');
};

export const clsxm = (...classes: ClassValue[]) => twMerge(clsx(...classes));

export default clsxm;

export const clsxmBang = (...classes: ClassValue[]) => {
  const removeBanges = (str: string) => str.replace(/!/g, '');
  const removeBangesFromClasses = (classes: ClassValue[]) => {
    return classes.map((cls): ClassValue => {
      if (typeof cls === 'string') {
        return removeBanges(cls);
      }
      if (Array.isArray(cls)) {
        return removeBangesFromClasses(cls);
      }
      if (typeof cls === 'object' && cls !== null) {
        return Object.fromEntries(
          Object.entries(cls).map(([key, value]) => [key, removeBanges(value)])
        );
      }
      return cls;
    });
  };
  const mergedClasses = twMerge(clsx(...removeBangesFromClasses(classes)));
  const bangAddedClasses = '!' + mergedClasses.replace(/ /g, ' !');

  return bangAddedClasses;
};
