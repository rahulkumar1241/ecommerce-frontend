import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

const RatingComponent = (props: any) => {
  const { rating,size }: any = props;
  return (
    <Stack spacing={1} >
      <Rating name="half-rating-read" size={size || 'medium'}  value={rating || 0} defaultValue={0} precision={0.5} readOnly />
    </Stack>
  );
}

export default RatingComponent;

