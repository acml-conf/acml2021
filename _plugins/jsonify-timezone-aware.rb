require 'date'

module Jekyll
  module JsonifyTimezoneAware
    def jsonify_tz(input)
      as_liquid_tz(input).to_json
    end

    def as_liquid_tz(item)
      case item
      when Hash
        item.each_with_object({}) { |(k, v), result| result[as_liquid_tz(k)] = as_liquid_tz(v) }
      when Array
        item.map { |i| as_liquid_tz(i) }
      else
        if item.respond_to?(:to_liquid)
          liquidated = item.to_liquid
          # prevent infinite recursion for simple types (which return `self`)
          if liquidated == item
          	try_date_xmlschema(item)
          else
            as_liquid_tz(liquidated)
          end
        else
          try_date_xmlschema(item)
        end
      end
    end

   	def try_date_xmlschema(input)
   		if valid_date?(input)
   			date_to_xmlschema(input)
   		else
   			input
   		end
   	end

   	def valid_date?(str, format="%F %T")
   		begin
		  	Date.strptime(str,format) 
		  rescue 
		  	false
		  else
		  	true
		  end
		end

  end
end

Liquid::Template.register_filter(Jekyll::JsonifyTimezoneAware)