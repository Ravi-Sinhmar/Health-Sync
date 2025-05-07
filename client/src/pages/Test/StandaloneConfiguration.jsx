import React from 'react';
import {
  Accordion,
  AccordionItem,
  Input,
  Radio,
  RadioGroup,
  Switch,
  Tooltip,
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
} from '@heroui/react';
import { Icon } from '@iconify/react';

const StandaloneConfiguration = () => {
  // State for the modal
  const [warningModal, setWarningModal] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  // State for the configuration sections
  const [passwordPolicy, setPasswordPolicy] = React.useState({
    passLength: {
      label: 'Minimum Password Length',
      type: 'number',
      min: 8,
      max: 16,
      value: 8
    },
    upperCase: {
      label: 'Uppercase Characters (A-Z)',
      type: 'number',
      min: 1,
      max: 4,
      value: 1
    },
    lowerCase: {
      label: 'Lowercase Characters (a-z)',
      type: 'number',
      min: 1,
      max: 4,
      value: 1
    },
    digits: {
      label: 'Digits (0-9)',
      type: 'number',
      min: 1,
      max: 4,
      value: 1
    },
    specialLetter: {
      label: 'Special Characters (@, #, !, etc.)',
      type: 'number',
      min: 1,
      max: 4,
      value: 1
    },
    expirationDays: {
      label: 'Password Vailidty (days)',
      type: 'number',
      min: 30,
      max: 120,
      value: 30
    },
    passwordHistory: {
      label: 'Password History Retention',
      type: 'number',
      min: 3,
      max: 12,
      value: 3
    },
    noUsername: {
      label: 'Not Allow Username',
      component: 'Switch',
      value: false,
      tooltip: "When enabled, user can't use username as password."
    },
  });

  const [accSecurity, setAccSecurity] = React.useState({
    wrongAttempts: {
      label: 'Account Lockout Threshold',
      type: 'number',
      min: 3,
      max: 10,
      value: 3
    },
    permanentLockout: {
      label: 'Auto Unlock',
      component: 'Switch',
      value: false,
      tooltip: 'When enabled, locked accounts will automatically unlock after a set time.'
    },
    maxWrongAttempts: {
      label: 'Daily Lockout Limit',
      type: 'number',
      tooltip: 'Defines the total number of temporary lockouts allowed per day before permanently locking the account.',
      min: 2,
      max: 5,
      value: 2,
      disabled: true
    },
    inactiveDuration: {
      label: 'Re-attempt wait time (mins)',
      type: 'number',
      tooltip: 'Defines how long a locked user must wait before their account is auto-unlocked.',
      min: 15,
      max: 60,
      value: 15,
      disabled: true
    },
    isDisabledDormantUserJob: {
      label: 'Auto-Account Deactivation',
      component: 'Switch',
      value: false,
      tooltip: 'When enabled, inactive accounts will be automatically deactivated after a set period.'
    },
    durationForDisabledDormantUserJob: {
      label: 'Dormant Account Deactivation (Days)',
      type: 'number',
      value: 30,
      disabled: true
    },
  });

  const [sessionConfiguration, setSessionConfiguration] = React.useState({
    userIdleSessionTime: {
      label: 'Idle Session Timeout (mins)',
      type: 'number',
      min: 30,
      max: 120,
      value: 30
    },
    userMaxSessionTime: {
      label: 'Max Session Duration (mins)',
      type: 'number',
      tooltip: 'Limits the total time a session can remain active, regardless of activity.',
      min: 240,
      max: 600,
      value: 240
    },
  });

  const [mfaConfiguration, setMFAConfiguration] = React.useState({
    mfaMechanism: {
      component: 'RadioGroup',
      value: 'totpMFA',
      options: [
        {
          value: 'totpMFA',
          label: 'TOTP',
          tooltip: 'Requires users to enter a time-based authentication code from an authenticator app.'
        },
        {
          value: 'emailMFA',
          label: 'Email',
          tooltip: 'Sends a one-time authentication code via email.'
        },
      ],
    },
  });

  const [enforce, setEnforce] = React.useState(false);

  // Handlers for each section
  const handlePasswordPolicyChange = (key, value) => {
    if (passwordPolicy[key].type === 'number' && parseInt(value) < 0) return;
    setPasswordPolicy(prev => ({
      ...prev,
      [key]: { ...prev[key], value }
    }));
  };

  const handleAccSecurityChange = (key, value) => {
    if (accSecurity[key].type === 'number' && parseInt(value) < 0) return;

    setAccSecurity(prev => {
      const newState = { ...prev, [key]: { ...prev[key], value } };
      
      if (key === 'permanentLockout') {
        newState.inactiveDuration.disabled = !value;
        newState.maxWrongAttempts.disabled = !value;
      } else if (key === 'isDisabledDormantUserJob') {
        newState.durationForDisabledDormantUserJob.disabled = !value;
      }
      
      return newState;
    });
  };

  const handleSessionConfigChange = (key, value) => {
    if (sessionConfiguration[key].type === 'number' && parseInt(value) < 0) return;
    setSessionConfiguration(prev => ({
      ...prev,
      [key]: { ...prev[key], value }
    }));
  };

  const handleMFAConfigChange = (key, value) => {
    setMFAConfiguration(prev => ({
      ...prev,
      [key]: { ...prev[key], value }
    }));
  };

  const settings = [
    {
      key: 'passwordPolicy',
      data: passwordPolicy,
      handler: handlePasswordPolicyChange,
      title: 'Password Policy',
      description: 'Defines the complexity and expiration rules for user passwords to enhance security.',
    },
    {
      key: 'accSecurity',
      data: accSecurity,
      handler: handleAccSecurityChange,
      title: 'Account Security',
      description: 'Defines account lockout and deactivation policies to prevent unauthorized access.',
    },
    {
      key: 'sessionConfiguration',
      data: sessionConfiguration,
      handler: handleSessionConfigChange,
      title: 'Session Configuration',
      description: 'Defines user session management policies to enhance security and performance.',
    },
    {
      key: 'mfaConfiguration',
      data: mfaConfiguration,
      handler: handleMFAConfigChange,
      title: 'MFA Configuration',
      description: 'Enforces additional authentication layers to improve security.',
    },
  ];

  const handleApply = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setWarningModal(false);
      console.log('Configuration saved:', {
        passwordPolicy,
        accSecurity,
        sessionConfiguration,
        mfaConfiguration,
        enforce
      });
    }, 1000);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Configuration</h1>
        <div className="flex gap-2">
          <Button
            color="primary"
            variant="ghost"
            onPress={() => {
              // Reset to default values
              setPasswordPolicy(prev => ({
                ...prev,
                passLength: { ...prev.passLength, value: 8 },
                upperCase: { ...prev.upperCase, value: 1 },
                lowerCase: { ...prev.lowerCase, value: 1 },
                digits: { ...prev.digits, value: 1 },
                specialLetter: { ...prev.specialLetter, value: 1 },
                expirationDays: { ...prev.expirationDays, value: 30 },
                passwordHistory: { ...prev.passwordHistory, value: 3 },
                noUsername: { ...prev.noUsername, value: false },
              }));
              setAccSecurity(prev => ({
                ...prev,
                wrongAttempts: { ...prev.wrongAttempts, value: 3 },
                permanentLockout: { ...prev.permanentLockout, value: false },
                maxWrongAttempts: { ...prev.maxWrongAttempts, value: 2, disabled: true },
                inactiveDuration: { ...prev.inactiveDuration, value: 15, disabled: true },
                isDisabledDormantUserJob: { ...prev.isDisabledDormantUserJob, value: false },
                durationForDisabledDormantUserJob: { ...prev.durationForDisabledDormantUserJob, value: 30, disabled: true },
              }));
              setSessionConfiguration(prev => ({
                ...prev,
                userIdleSessionTime: { ...prev.userIdleSessionTime, value: 30 },
                userMaxSessionTime: { ...prev.userMaxSessionTime, value: 240 },
              }));
              setMFAConfiguration(prev => ({
                ...prev,
                mfaMechanism: { ...prev.mfaMechanism, value: 'totpMFA' },
              }));
              setEnforce(false);
            }}
            disabled={saving}
          >
            Reset
          </Button>
          <Button color="primary" onPress={() => setWarningModal(true)}>
            Apply
          </Button>
        </div>
      </div>

      <Accordion
        variant="light"
        itemClasses={{
          base: 'bg-default-50 border-default-200 border mt-4 px-4 rounded-large',
          content: 'pb-6',
          title: 'text-default-700 font-semibold',
        }}
        showDivider={false}
        defaultExpandedKeys={['passwordPolicy', 'accSecurity']}
        selectionMode="multiple"
      >
        {settings.map((setting) => (
          <AccordionItem
            key={setting.key}
            aria-label={setting.title}
            title={
              <div>
                {setting.title}
                <div className="text-sm mt-1 font-normal text-default-400">
                  {setting.description}
                </div>
              </div>
            }
          >
            <div className={`gap-y-6 ${setting.noGrid ? 'flex flex-col' : 'grid grid-cols-2 gap-x-16'}`}>
              {Object.entries(setting.data).map(([key, obj]) =>
                obj.disabled ? null : (
                  <div
                    className={`grid grid-cols-2 gap-2 ${setting.noGrid ? 'w-1/2' : 'items-center'}`}
                    key={key}
                  >
                    {obj.label && (
                      <div className="text-sm col-span-1 items-center flex gap-2">
                        {obj.label}
                        {obj.tooltip && (
                          <Tooltip
                            showArrow
                            content={obj.tooltip}
                            classNames={{
                              base: 'max-w-80',
                            }}
                          >
                            <Icon
                              className="text-default-700"
                              icon="solar:info-circle-line-duotone"
                              width={16}
                            />
                          </Tooltip>
                        )}
                      </div>
                    )}
                    <div className="col-span-1">
                      {(!obj.component || obj.component === 'Input') && (
                        <Input
                          name={key}
                          isDisabled={saving}
                          value={obj.value}
                          type={obj.type || 'text'}
                          min={obj.min}
                          max={obj.max}
                          classNames={{
                            inputWrapper: [
                              'bg-white',
                              'hover:bg-white',
                              'group-data-[hover=true]:bg-white',
                              'group-data-[focus=true]:bg-white',
                              'border',
                            ],
                          }}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                              setting.handler(key, value);
                              return;
                            }
                            if (e.target.type === 'number') {
                              const numValue = Number(value);
                              if (
                                !isNaN(numValue) &&
                                (obj.min === undefined || numValue >= obj.min) &&
                                (obj.max === undefined || numValue <= obj.max)
                              ) {
                                setting.handler(key, value);
                              }
                            } else {
                              setting.handler(key, value);
                            }
                          }}
                        />
                      )}

                      {obj.component === 'Switch' && (
                        <Switch
                          size="sm"
                          isDisabled={saving}
                          name={key}
                          isSelected={obj.value}
                          onValueChange={(isSelected) =>
                            setting.handler(key, isSelected)
                          }
                        />
                      )}
                      {obj.component === 'RadioGroup' && (
                        <RadioGroup
                          classNames={{ wrapper: 'gap-8' }}
                          isDisabled={saving}
                          value={obj.value}
                          orientation="horizontal"
                          onValueChange={(value) => setting.handler(key, value)}
                        >
                          {obj.options.map((option) => (
                            <Radio
                              key={option.value}
                              classNames={{
                                label: 'text-sm',
                                labelWrapper: 'z-10',
                              }}
                              value={option.value}
                            >
                              <div className="items-center flex gap-1.5">
                                {option.label}
                                {option.tooltip && (
                                  <Tooltip
                                    showArrow
                                    content={option.tooltip}
                                    classNames={{
                                      base: 'max-w-80',
                                    }}
                                  >
                                    <Icon
                                      className="text-default-700"
                                      icon="solar:info-circle-line-duotone"
                                      width={16}
                                    />
                                  </Tooltip>
                                )}
                              </div>
                            </Radio>
                          ))}
                        </RadioGroup>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </AccordionItem>
        ))}
      </Accordion>

      <Card
        shadow="none"
        classNames={{
          base: 'mt-4 bg-default-50 border border-default-200 p-2 mx-2',
        }}
      >
        <CardBody>
          <div>
            <div className="select-none text-base font-semibold text-default-700">
              Inheritance
            </div>
            <div className="text-sm mt-1 font-normal text-default-400">
              Defines whether security configurations should apply only to newly onboarded products or also to existing ones.
            </div>
            <div className="flex items-center mt-5 gap-5">
              <div className="select-none text-base font-medium flex items-center gap-1.5 text-default-700">
                Prospectively
                <Tooltip
                  showArrow
                  content="Applies security configurations only to products onboarded after changes applied."
                  classNames={{
                    base: 'max-w-80',
                  }}
                >
                  <Icon
                    className="text-default-700"
                    icon="solar:info-circle-line-duotone"
                    width={16}
                  />
                </Tooltip>
              </div>
              <Switch
                size="sm"
                isSelected={enforce}
                onValueChange={setEnforce}
                isDisabled={saving}
              />
              <div className="select-none text-base font-medium flex items-center gap-1.5 text-default-700">
                Retrospectively
                <Tooltip
                  showArrow
                  content="Applies security configurations to all existing and future products hosted on the platform."
                  classNames={{
                    base: 'max-w-80',
                  }}
                >
                  <Icon
                    className="text-default-700"
                    icon="solar:info-circle-line-duotone"
                    width={16}
                  />
                </Tooltip>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Modal
        isOpen={warningModal}
        onOpenChange={setWarningModal}
        hideCloseButton
        size="lg"
      >
        <ModalContent>
          <ModalHeader>
            You are about to apply Platform-wide changes.
          </ModalHeader>
          <ModalBody>
            This action will impact multiple Products. Changes may override
            existing settings and require manual intervention.
            <br />
            Are you sure you want to proceed?
            <div className="flex gap-2 mt-3 pb-3 justify-end">
              <Button
                color="primary"
                variant="ghost"
                onPress={() => setWarningModal(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button color="primary" onPress={handleApply} isLoading={saving}>
                Confirm & Apply
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default StandaloneConfiguration;