import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Box, Button, FormControl, FormLabel, Input, FormErrorMessage, Select } from '@chakra-ui/react';

const BookingSchema = Yup.object().shape({
  customerName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  service: Yup.string().required('Required'),
  date: Yup.date().required('Required').min(new Date(), 'Date must be in the future'),
  status: Yup.string().oneOf(['Confirmed', 'Pending', 'Cancelled']).required('Required'),
});

const BookingForm = ({ onSubmit, initialValues = {} }) => {
  return (
    <Box>
      <Formik
        initialValues={{
          customerName: '',
          service: '',
          date: '',
          status: 'Pending',
          ...initialValues,
        }}
        validationSchema={BookingSchema}
        onSubmit={(values, actions) => {
          onSubmit(values);
          actions.setSubmitting(false);
        }}
      >
        {(props) => (
          <Form>
            <Field name="customerName">
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.customerName && form.touched.customerName}>
                  <FormLabel htmlFor="customerName">Customer Name</FormLabel>
                  <Input {...field} id="customerName" placeholder="Customer Name" />
                  <FormErrorMessage>{form.errors.customerName}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field name="service">
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.service && form.touched.service}>
                  <FormLabel htmlFor="service">Service</FormLabel>
                  <Input {...field} id="service" placeholder="Service" />
                  <FormErrorMessage>{form.errors.service}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field name="date">
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.date && form.touched.date}>
                  <FormLabel htmlFor="date">Date</FormLabel>
                  <Input {...field} id="date" placeholder="Date" type="date" />
                  <FormErrorMessage>{form.errors.date}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field name="status">
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.status && form.touched.status}>
                  <FormLabel htmlFor="status">Status</FormLabel>
                  <Select {...field} id="status">
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </Select>
                  <FormErrorMessage>{form.errors.status}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Button
              mt={4}
              colorScheme="teal"
              isLoading={props.isSubmitting}
              type="submit"
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default BookingForm;