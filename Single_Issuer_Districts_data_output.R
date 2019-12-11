
library(tidyverse)


state_regions <- read_csv("State_Regions.csv")

county_rating <- read_csv("individual_county_rating_area_crosswalk_2019_2019_04_01.csv") %>%   # County to Rating Area Cross Walk
  mutate(county_fips = paste0("0",fips_code)) %>%
  separate(county_fips, c(NA, "county_fips"), -5)

issuers_counties   <- read_csv("individual_issuer_county_report_2019_2019_08_29.csv") %>%      # Issuers to Counties Cross Walk With count of plans offered by issuer
  mutate(county_fips = paste0("0",fips_code)) %>%
  separate(county_fips, c(NA, "county_fips"), -5)


number_issuers_counties <- issuers_counties %>%                                 # filter it down to on market plans
  filter(market == "on_market") %>%
  group_by(state, county_name, county_fips) %>%                                 # group by county 
  summarize(count_issuers = n(), count_plans = sum(plan_count)) %>% ungroup()   # count the issuers and total the plans in each county

write.csv(number_issuers_counties, file = "plans_per_county.csv")

number_issuers_counties %>%
  group_by(state) %>%
  summarize(median(count_plans)) %>%
  arrange(-`median(count_plans)`) %>%
  View()

median(number_issuers_counties$count_plans)


number_issuers_counties <- read_csv("plans_per_county.csv")

issuers_rating_area <-
  number_issuers_counties %>%
  inner_join(county_rating) %>%
  select(AREA = rating_area_id, count_issuers, count_plans, county_name) %>%
  mutate(SINGLEISSUER = ifelse(count_issuers == 1, 1, 0))



plans_regular <- read_csv("plan_data.csv")

plans_regular






issuers_by_area  <-
  plans_regular %>%
  select(ST, CARRIER, AREA) %>%
  inner_join(state_regions) %>%
  distinct() %>%
  group_by(Region, ST, AREA) %>%
  summarize(ISSUERS = n(), SINGLEISSUER = ifelse(ISSUERS == 1, 1, 0 ))


issuers_area_plan_county <-
number_issuers_counties %>%
  inner_join(county_rating)  # Now we have county + rating area id + count of plans in the county/rating area + count of issuers in county/RA
  

silver_plans <-              # Now, we have the plans, filter them to just silver and actively marketed, and join them so that each plan is linked to the counties it operates in and the number of issuers that operate in its county
  plans_regular %>%
  filter( METAL == "Silver" , actively_marketed == TRUE) %>%
  inner_join(issuers_area_plan_county, by = c("AREA" = "rating_area_id"))  %>%
  inner_join(state_regions)


# Things I want to calculate
# Lowest, Median, and Max Premium in Each County
# Lowest, Median, and Max Deductible in Each County
# Where you are required to pay the whole deductible in 100% of silver plans of ER, & Mental Health, 
# Percentage of those plans that then require you to keep paying 

plans_regular %>% group_by(AREA) %>% filter(ST == "NH") %>% summarize(count = n()) %>% View()
 
x3 <- rep(seq(1:80), 85)
length(x3)
x3 <- c(x3, seq(1:30))
y3 <- rep(seq(1:86), each = 80)
length(y3)
y3 <- y3[1:6830]


just_silver_plans <-
plans_regular %>%
  filter( METAL == "Silver" , actively_marketed == TRUE) %>%
mutate(
  ER_Indicator = ifelse(ER_CopayInnTier1 %in% c(0,99), "Coinsurance","Copay"),
ER_Application =  ifelse(ER_CopayInnTier1 %in% c(0,99) , ER_CoinsInnTier1, ER_CopayInnTier1),
ER_Value =  ifelse(ER_CopayInnTier1 %in% c(0,99), paste0(ER_CoinsInnTier1A, "% of Bill") , paste0("$",ER_CopayInnTier1A)),

ER_Description = case_when(
  ER_Application ==  1  ~ "No Charge",
  ER_Application  ==   2 ~ "Pay Everything Until Deductible",
  ER_Application ==  3 ~ "Always Pay Benefit",
  ER_Application == 4 ~ "Use Only After Paying Deductible"
),

ER_Keep_Paying = ifelse( ER_Description == "Use Only After Paying Deductible", 1, 0 ),


ER_Deductible = case_when(
  ER_Application ==  1  ~ "NotResponsible",
  ER_Application  ==   2 ~ "FullDeductible",
  ER_Application ==  3 ~ "JustBenefit",
  ER_Application == 4 ~ "FullDeductible"
  
),

ER_No_Choice = ifelse( ER_Deductible == "FullDeductible", 1, 0 )

) %>%
  
arrange(desc(ER_No_Choice ), Med_Deductible_Amount) %>%
  
  mutate(xint = x3, 
         yint = y3,
         deductible_value =
           case_when(
             Med_Deductible_Amount < 4001 ~ "lessthan4000",
             Med_Deductible_Amount > 4000~ "greaterthan4000"
      
                   )
         )


write.csv(just_silver_plans, file = "silverplans.csv")

just_silver_plans %>%
  add_count() %>%
  group_by(n, deductible_value) %>%
  summarize(count = n()) %>%
  mutate(percent = count/n *100)

#46.3% of plans where you pay the full deductible charge over $4000

## Identify rating area/counties to highlight
just_silver_plans %>%
  group_by(
    AREA
    
  ) %>%
  summarize(
    ER_No_Choice = mean(ER_No_Choice)
    
  ) %>%
  filter( ER_No_Choice == 1) %>%
  View()



##########################
# County-level data
# 3190 dots
# 50 columns across 
# 63.8 rows up
x4 <- rep(seq(1:50), 63)
3190 - length(x4)
x4 <- c(x4, seq(1:40))
x4 <- x4 + 5

y4 <- rep(seq(1:64), each = 50)
length(y4) - 3190
y4 <- y4[1:3190]


# Single Issuer has 18 columns across up 62 + .38 floors

x5 <- rep(seq(1:18), 62)
1123 - length(x5)
x5 <- c(x5, seq(1:7))
x5 <- x5 + 5 + 33

x6 <- rep(seq(1:33), 62)
2067 - length(x6)
x6 <- c(x6, seq(1:21))

x7 <- c(x5, x6)
length(x7)

y5 <- rep(seq(1:63), each = 18)
y5 <- y5[1:1123]

y6 <- rep(seq(1:63), each = 33)
y6 <- y6[1:2067]

y7 <- c(y5, y6)
length(y7)

County_Plan_Facts <- 
silver_plans %>%
  group_by(Region, ST, AREA, county_name, county_fips, count_issuers ) %>%
  mutate(plans = n()) %>%
  ungroup() %>%
  mutate(
         
         ER_Indicator = ifelse(ER_CopayInnTier1 %in% c(0,99), "Coinsurance","Copay"),
         ER_Application =  ifelse(ER_CopayInnTier1 %in% c(0,99) , ER_CoinsInnTier1, ER_CopayInnTier1),
         ER_Value =  ifelse(ER_CopayInnTier1 %in% c(0,99), paste0(ER_CoinsInnTier1A, "% of Bill") , paste0("$",ER_CopayInnTier1A)),
         
         ER_Description = case_when(
           ER_Application ==  1  ~ "No Charge",
           ER_Application  ==   2 ~ "Pay Everything Until Deductible",
           ER_Application ==  3 ~ "Always Pay Benefit",
           ER_Application == 4 ~ "Use Only After Paying Deductible"
         ),
         
         ER_Keep_Paying = ifelse( ER_Description == "Use Only After Paying Deductible", 1, 0 ),
         
         
         ER_Deductible = case_when(
           ER_Application ==  1  ~ "Not Responsible",
           ER_Application  ==   2 ~ "Full Deductible",
           ER_Application ==  3 ~ "Just Benefit",
           ER_Application == 4 ~ "Full Deductible"
           
         ),
         
         ER_No_Choice = ifelse( ER_Deductible == "Full Deductible", 1, 0 ),
         
         
         OM_Indicator = ifelse(OM_CopayInnTier1 %in% c(0,99), "Coinsurance","Copay"),
         OM_Application =  ifelse(OM_CopayInnTier1 %in% c(0,99) , OM_CoinsInnTier1, OM_CopayInnTier1),
         OM_Value =  ifelse(OM_CopayInnTier1 %in% c(0,99), paste0(OM_CoinsInnTier1A, "% of Bill") , paste0("$",OM_CopayInnTier1A)),
         
         OM_Description = case_when(
           OM_Application ==  1  ~ "No Charge",
           OM_Application  ==   2 ~ "Pay Everything Until Deductible",
           OM_Application ==  3 ~ "Always Pay Benefit",
           OM_Application == 4 ~ "Use Only After Paying Deductible"
         ),
         
         
         OM_Keep_Paying = ifelse( OM_Description == "Use Only After Paying Deductible", 1, 0 ),
         
         
         
         OM_Deductible = case_when(
           OM_Application ==  1  ~ "Not Responsible",
           OM_Application  ==   2 ~ "Full Deductible",
           OM_Application ==  3 ~ "Just Benefit",
           OM_Application == 4 ~ "Full Deductible"
           
         ),
         
         
         OM_No_Choice = ifelse( OM_Deductible == "Full Deductible", 1, 0 )
         
         
  ) %>%
  
  group_by( Region, ST, AREA, county_name, county_fips, count_issuers, plans ) %>%
  summarize(Min_PREMI27 = min(PREMI27), Med_PREMI27 = median(PREMI27), Max_PREMI27 = max(PREMI27),
            Min_PREMI50 = min(PREMI50), Med_PREMI50 = median(PREMI50), Max_PREMI50 = max(PREMI50),
            Min_Med_Deduct = min(Med_Deductible_Amount), Med_Med_Deduct = median(Med_Deductible_Amount), Max_Med_Deduct = max(Med_Deductible_Amount),
            ER_PCT_Pay_Post = mean(ER_Keep_Paying),
            ER_PCT_Pay_Deductible = mean(ER_No_Choice),
            OM_PCT_Pay_Post = mean(OM_Keep_Paying),
            OM_PCT_Pay_Deductible  = mean(OM_No_Choice)
 
            )  %>%
  ungroup() %>%
  mutate(
 ER_COUNTY_NO_CHOICE = ifelse( ER_PCT_Pay_Deductible  == 1, 1, 0),
 OM_COUNTY_NO_CHOICE = ifelse( OM_PCT_Pay_Deductible  == 1, 1, 0),
 SINGLEISSUER = ifelse(count_issuers == 1, 1, 0),
 ER_Pay = ifelse(ER_COUNTY_NO_CHOICE == 1, "Pay Full Deductible Always", "Choice of Payment Plans"),
 OM_Pay = ifelse(OM_COUNTY_NO_CHOICE == 1, "Pay Full Deductible Always", "Choice of Payment Plans")
 

 ) %>%
  arrange(desc(ER_COUNTY_NO_CHOICE), Min_Med_Deduct) %>%
  mutate(
    xint1 = x4,
    yint1 = y4
  ) %>%
  arrange(desc(SINGLEISSUER), desc(ER_COUNTY_NO_CHOICE), Min_Med_Deduct) %>%
  mutate(
    xint2 = x7,
    yint2 = y7
  )




write.csv(County_Plan_Facts, file = "county_facts.csv")

max(County_Plan_Facts$xint1)
min(County_Plan_Facts$yint1)

nrow(County_Plan_Facts)

# 3190 
3190/(10*5) # 50 across, 64 rows up


mean(County_Plan_Facts$ER_COUNTY_NO_CHOICE)
# 0.6137931

County_Plan_Facts %>%
  group_by(SINGLEISSUER) %>%
  add_count() %>%
  group_by(n, SINGLEISSUER, ER_COUNTY_NO_CHOICE) %>%
  summarize(numerator = n()) %>%
  filter(ER_COUNTY_NO_CHOICE == 1) %>%
  mutate(percent = numerator/n *100)



County_Plan_Facts %>%
         group_by(SINGLEISSUER) %>%
  summarize(medainx = median(xint2), maxy = max(yint2))



# 2067 Multi-issuer counties
# 1123 Single-Issuer Counties 

2067/33
1123/18




duplicate_counties <- County_Plan_Facts %>% 
  group_by(ST, county_name, county_fips) %>%
  summarize(count = n()) %>%
  ungroup() %>%
  filter(count > 1) 

nrow(duplicate_counties)
# there are 41 counties with split jurisdictions. 
# Verifing, though, we know that none of the split jurisdiction 

duplicates <-
County_Plan_Facts %>%
filter(
  county_fips %in% duplicate_counties$county_fips
) %>%
  arrange(desc(county_fips))

duplicates %>% View()




nrow(silver_plans) # 6830 silver plans actively marketed on state ACA marketplaces across the country

County_Plan_Facts$count_issuers


County_Plan_Facts %>%
  filter( is.na(County_Plan_Facts[,11]) == TRUE)


number_issuers_counties %>%
  filter(state == "NE") %>%
  select(count_plans) %>%
  summary()

