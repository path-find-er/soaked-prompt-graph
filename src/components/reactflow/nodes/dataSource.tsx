import clsxm from '@/utils/clsxm';

type dataSourceProps = {
  className?: string;
} & React.ComponentPropsWithoutRef<'div'>;

const dataSource: React.FC<dataSourceProps> = ({ className }) => {
  // TODO:

  return <div className={clsxm('', className)}></div>;
};

export default dataSource;
