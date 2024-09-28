import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import IpCheck from '@/components/IpCheck.vue';

jest.mock('@/api/ipService', () => ({
  fetchIpData: jest.fn(() => Promise.resolve({
    location: 'New York, USA',
    countryCode: 'US',
    timezone: 'America/New_York',
  })),
}));

describe('IpCheck.vue', () => {
  it('renders the IP Lookup header', () => {
    const wrapper = shallowMount(IpCheck);
    expect(wrapper.find('h2').text()).toBe('IP Lookup');
  });

  it('adds a new IP row when button is clicked', async () => {
    const wrapper = shallowMount(IpCheck);
    const addButton = wrapper.find('button');
    
    await addButton.trigger('click');
    
    const ipRows = wrapper.findAll('.ip-list__item');
    expect(ipRows.length).toBe(1);
  });

  it('displays an error for invalid IP', async () => {
    const wrapper = shallowMount(IpCheck);
    
    await wrapper.vm.addIpRow();

    const input = wrapper.find('input');
    await input.setValue('invalid_ip');
    await input.trigger('blur');

    const errorMessage = wrapper.find('.ip-list__error').text();
    expect(errorMessage).toBe('Invalid IP address');
  });

  it('fetches and displays location for valid IP', async () => {
    const wrapper = shallowMount(IpCheck);

    await wrapper.vm.addIpRow();

    const input = wrapper.find('input');
    await input.setValue('192.168.0.1');
    await input.trigger('blur');

    await flushPromises();

    const location = wrapper.find('.ip-list__location').text();
    expect(location).toContain('New York, USA');
  });
});
