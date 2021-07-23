import React from 'react';
import PureManagementPlanCard from '../../components/Crop/ManagementPlanCard';
import { componentDecorators } from '../Pages/config/decorators';

export default {
  title: 'Components/ManagementPlanCard',
  component: PureManagementPlanCard,
  decorators: componentDecorators,
};

const Template = (args) => <PureManagementPlanCard {...args} />;
export const Primary = Template.bind({});
Primary.args = {
};