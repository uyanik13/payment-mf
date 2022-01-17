Feature:
  As Esen
  I want to pay by CC in the checkout process
  So That I can purchase the items

  Scenario: Pay by credit card option without registered card information new credit card form on desktop device
    Given that Esen visits checkout on "Desktop" device
    Given that Esen has selected ship to as "Turkey" on the Modanisa Website
    Given that Esen has proceeded to address and shipment selection checkout page
    Given Esen sees orders shipped from Modanisa and marketplace enabled Civil supplier
    Given Esen has no saved credit card in her account
    When Esen has selected proceed payment after reviewing the order
    Then Esen should be able to fill mandatory, name on card,card number, month & year, CVV fields
    Then Esen should be able to see 3d secure payment option
    Then Esen should be able to see Save my card information option is pre-selected
    Then Esen should be able to see the optional Card nickname field
    Then Esen should see the installment options section with title & view all installment options link
    When Esen is typing "Esen" card information in the "Card Owner Name"
    When Esen is typing "4111111111111111" card information in the "Card Number"
    When Esen is select "12" card information in the "Card Expire Date Month"
    When Esen is select "2025" card information in the "Card Expire Date Year"
    When Esen is typing "232" card information in the "Card Security Code"
    Then Esen should "Esen" on "Card Owner Name" reflecting simultaneously on the card animation
    Then Esen should "4111111111111111" on "Card Number" reflecting simultaneously on the card animation
    Then Esen should "12" on "Card Expire Date Month" reflecting simultaneously on the card animation
    Then Esen should "2025" on "Card Expire Date Year" reflecting simultaneously on the card animation
    Then Esen should "232" on "Card Security Code" reflecting simultaneously on the card animation

  Scenario: Pay by credit card option without registered card information new credit card form on mobile device
    Given that Esen visits checkout on "Mobile" device
    Given that Esen has selected ship to as "Turkey" on the Modanisa Website
    Given that Esen has proceeded to address and shipment selection checkout page
    Given Esen sees orders shipped from Modanisa and marketplace enabled Civil supplier
    Given Esen has no saved credit card in her account
    When Esen has selected proceed payment after reviewing the order
    Then Esen should be able to fill mandatory, name on card,card number, month & year, CVV fields
    Then Esen should be able to see 3d secure payment option
    Then Esen should be able to see Save my card information option is pre-selected
    Then Esen should be able to see the optional Card nickname field
    Then Esen should see the installment options section with view all installment options link
    When Esen is typing "Esen" card information in the "Card Owner Name"
    When Esen is typing "4111111111111111" card information in the "Card Number"
    When Esen is select "12" card information in the "Card Expire Date Month"
    When Esen is select "2025" card information in the "Card Expire Date Year"
    When Esen is typing "232" card information in the "Card Security Code"

  Scenario: Validate Information
    Given that Esen visits checkout on "Desktop" device
    Given that Esen has selected ship to as "Turkey" on the Modanisa Website
    Given that Esen has proceeded to address and shipment selection checkout page
    Given Esen sees orders shipped from Modanisa and marketplace enabled Civil supplier
    When Esen has selected proceed payment after reviewing the order
    Given Esen is on add new credit card form in Payment Option Selection page
    When Esen is typing " " card information in the "Card Owner Name"
    When Esen clicks another field or area on page
    Then Esen should see "This field is required" message on "Card Owner Name"
    When Esen is typing " " card information in the "Card Number"
    When Esen clicks another field or area on page
    Then Esen should see "This field is required" message on "Card Number"
    When Esen is typing "552608231312311" card information in the "Card Number"
    When Esen clicks another field or area on page
    Then Esen should see "Card number is incorrect" message on "Card Number"
    When Esen is typing "9526082313123111" card information in the "Card Number"
    When Esen clicks another field or area on page
    Then Esen should see "Card number is incorrect" message on "Card Number"
    When Esen is typing "4111111111111111" card information in the "Card Number"
    When Esen clicks another field or area on page
    Then Esen should see no error message on "Card Number"
    When Esen is select "" card information in the "Card Expire Date Month"
    When Esen clicks another field or area on page
    Then Esen should see "This field is required" message on "Card Expire Date Month"
    When Esen is select "" card information in the "Card Expire Date Year"
    When Esen clicks another field or area on page
    Then Esen should see "This field is required" message on "Card Expire Date Year"
    When Esen is typing " " card information in the "Card Security Code"
    When Esen clicks another field or area on page
    Then Esen should see "This field is required" message on "Card Security Code"
    When Esen is typing "551155" card information in the "Card Number"
    Then Esen should see credit "Mastercard" updated with logo on card animation
    When Esen is typing "448537" card information in the "Card Number"
    Then Esen should see credit "Visa" updated with logo on card animation
    When Esen is typing "370000" card information in the "Card Number"
    Then Esen should see credit "Amex" updated with logo on card animation
    When Esen is typing "979201" card information in the "Card Number"
    Then Esen should see credit "Troy" updated with logo on card animation

  Scenario: Remove/Reselect saved card option
    Given that Esen visits checkout on "Desktop" device
    Given that Esen has selected ship to as "Turkey" on the Modanisa Website
    Given that Esen has proceeded to address and shipment selection checkout page
    Given Esen sees orders shipped from Modanisa and marketplace enabled Civil supplier
    Given Esen has no saved credit card in her account
    When Esen has selected proceed payment after reviewing the order
    Given Esen sees the Save my card information option is selected
    When Esen unmarks Save my credit card information for future orders
    Then Esen shouldn't be able to see "Card Nick Name" field
    When Esen reselects Save my credit card information for future orders option
    Then Esen should be able to see "Card Nick Name" field



